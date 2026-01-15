<?php

namespace App\Services;

use App\Models\Tournament;
use App\Models\CompetitionGroup;
use App\Models\MatchEvent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BracketService
{
    /**
     * Predefined bracket templates for standard tournament sizes.
     * Each template defines the complete bracket structure with advancement rules.
     */
    protected function getBracketTemplates(): array
    {
        return [
            2 => [
                'rounds' => 1,
                'structure' => [
                    1 => [ // Round 1 (Final)
                        ['position' => 0, 'feeds_to' => null, 'feeds_slot' => null]
                    ]
                ]
            ],
            4 => [
                'rounds' => 2,
                'structure' => [
                    1 => [ // Round 1 (Semi-finals)
                        ['position' => 0, 'feeds_to' => ['round' => 2, 'position' => 0, 'slot' => 'a']],
                        ['position' => 1, 'feeds_to' => ['round' => 2, 'position' => 0, 'slot' => 'b']]
                    ],
                    2 => [ // Round 2 (Final)
                        ['position' => 0, 'feeds_to' => null, 'feeds_slot' => null]
                    ]
                ]
            ],
            8 => [
                'rounds' => 3,
                'structure' => [
                    1 => [ // Round 1 (Quarterfinals)
                        ['position' => 0, 'feeds_to' => ['round' => 2, 'position' => 0, 'slot' => 'a']],
                        ['position' => 1, 'feeds_to' => ['round' => 2, 'position' => 0, 'slot' => 'b']],
                        ['position' => 2, 'feeds_to' => ['round' => 2, 'position' => 1, 'slot' => 'a']],
                        ['position' => 3, 'feeds_to' => ['round' => 2, 'position' => 1, 'slot' => 'b']]
                    ],
                    2 => [ // Round 2 (Semi-finals)
                        ['position' => 0, 'feeds_to' => ['round' => 3, 'position' => 0, 'slot' => 'a']],
                        ['position' => 1, 'feeds_to' => ['round' => 3, 'position' => 0, 'slot' => 'b']]
                    ],
                    3 => [ // Round 3 (Final)
                        ['position' => 0, 'feeds_to' => null, 'feeds_slot' => null]
                    ]
                ]
            ],
            16 => [
                'rounds' => 4,
                'structure' => [
                    1 => [ // Round 1
                        ['position' => 0, 'feeds_to' => ['round' => 2, 'position' => 0, 'slot' => 'a']],
                        ['position' => 1, 'feeds_to' => ['round' => 2, 'position' => 0, 'slot' => 'b']],
                        ['position' => 2, 'feeds_to' => ['round' => 2, 'position' => 1, 'slot' => 'a']],
                        ['position' => 3, 'feeds_to' => ['round' => 2, 'position' => 1, 'slot' => 'b']],
                        ['position' => 4, 'feeds_to' => ['round' => 2, 'position' => 2, 'slot' => 'a']],
                        ['position' => 5, 'feeds_to' => ['round' => 2, 'position' => 2, 'slot' => 'b']],
                        ['position' => 6, 'feeds_to' => ['round' => 2, 'position' => 3, 'slot' => 'a']],
                        ['position' => 7, 'feeds_to' => ['round' => 2, 'position' => 3, 'slot' => 'b']]
                    ],
                    2 => [ // Round 2
                        ['position' => 0, 'feeds_to' => ['round' => 3, 'position' => 0, 'slot' => 'a']],
                        ['position' => 1, 'feeds_to' => ['round' => 3, 'position' => 0, 'slot' => 'b']],
                        ['position' => 2, 'feeds_to' => ['round' => 3, 'position' => 1, 'slot' => 'a']],
                        ['position' => 3, 'feeds_to' => ['round' => 3, 'position' => 1, 'slot' => 'b']]
                    ],
                    3 => [ // Round 3
                        ['position' => 0, 'feeds_to' => ['round' => 4, 'position' => 0, 'slot' => 'a']],
                        ['position' => 1, 'feeds_to' => ['round' => 4, 'position' => 0, 'slot' => 'b']]
                    ],
                    4 => [ // Round 4 (Final)
                        ['position' => 0, 'feeds_to' => null, 'feeds_slot' => null]
                    ]
                ]
            ],
            32 => [
                'rounds' => 5,
                'structure' => [
                    1 => array_map(fn($i) => [
                        'position' => $i,
                        'feeds_to' => ['round' => 2, 'position' => intdiv($i, 2), 'slot' => $i % 2 === 0 ? 'a' : 'b']
                    ], range(0, 15)),
                    2 => array_map(fn($i) => [
                        'position' => $i,
                        'feeds_to' => ['round' => 3, 'position' => intdiv($i, 2), 'slot' => $i % 2 === 0 ? 'a' : 'b']
                    ], range(0, 7)),
                    3 => array_map(fn($i) => [
                        'position' => $i,
                        'feeds_to' => ['round' => 4, 'position' => intdiv($i, 2), 'slot' => $i % 2 === 0 ? 'a' : 'b']
                    ], range(0, 3)),
                    4 => array_map(fn($i) => [
                        'position' => $i,
                        'feeds_to' => ['round' => 5, 'position' => intdiv($i, 2), 'slot' => $i % 2 === 0 ? 'a' : 'b']
                    ], range(0, 1)),
                    5 => [
                        ['position' => 0, 'feeds_to' => null, 'feeds_slot' => null]
                    ]
                ]
            ],
            64 => [
                'rounds' => 6,
                'structure' => [
                    1 => array_map(fn($i) => [
                        'position' => $i,
                        'feeds_to' => ['round' => 2, 'position' => intdiv($i, 2), 'slot' => $i % 2 === 0 ? 'a' : 'b']
                    ], range(0, 31)),
                    2 => array_map(fn($i) => [
                        'position' => $i,
                        'feeds_to' => ['round' => 3, 'position' => intdiv($i, 2), 'slot' => $i % 2 === 0 ? 'a' : 'b']
                    ], range(0, 15)),
                    3 => array_map(fn($i) => [
                        'position' => $i,
                        'feeds_to' => ['round' => 4, 'position' => intdiv($i, 2), 'slot' => $i % 2 === 0 ? 'a' : 'b']
                    ], range(0, 7)),
                    4 => array_map(fn($i) => [
                        'position' => $i,
                        'feeds_to' => ['round' => 5, 'position' => intdiv($i, 2), 'slot' => $i % 2 === 0 ? 'a' : 'b']
                    ], range(0, 3)),
                    5 => array_map(fn($i) => [
                        'position' => $i,
                        'feeds_to' => ['round' => 6, 'position' => intdiv($i, 2), 'slot' => $i % 2 === 0 ? 'a' : 'b']
                    ], range(0, 1)),
                    6 => [
                        ['position' => 0, 'feeds_to' => null, 'feeds_slot' => null]
                    ]
                ]
            ]
        ];
    }

    /**
     * Generates a single-elimination bracket using predefined templates.
     */
    public function generate(Tournament $tournament): void
    {
        DB::transaction(function () use ($tournament) {
            Log::info("🎯 Generating brackets for tournament: {$tournament->title}");

            $registrations = $tournament->registrations()
                ->where('payment_status', 'paid')
                ->with(['athlete.ageCategory', 'athlete.weightCategory', 'athlete'])
                ->get();

            if ($registrations->isEmpty()) {
                Log::warning("⚠️ No approved registrations for tournament {$tournament->id}");
                return;
            }

            // Group athletes by category
            $groups = $registrations->groupBy(function ($reg) {
                $athlete = $reg->athlete;
                $ageId = $athlete->assigned_age_category_id ?? 'no-age';
                $weightId = $athlete->assigned_weight_category_id ?? 'no-weight';
                $gender = strtoupper(substr($athlete->gender ?? 'M', 0, 1));
                return "{$ageId}-{$weightId}-{$gender}";
            });

            foreach ($groups as $key => $registrations) {
                $participants = $registrations->pluck('athlete')->shuffle()->values();
                $participantCount = $participants->count();
                
                if ($participantCount < 2) {
                    Log::info("⚠️ Skipping group with only {$participantCount} participant(s)");
                    continue;
                }

                $firstAthlete = $participants->first();
                $ageCategory = $firstAthlete->ageCategory;
                $weightCategory = $firstAthlete->weightCategory;

                $group = CompetitionGroup::firstOrCreate(
                    [
                        'tournament_id' => $tournament->id,
                        'age_category_id' => $ageCategory->id,
                        'weight_category_id' => $weightCategory->id,
                        'gender' => strtoupper(substr($firstAthlete->gender ?? 'M', 0, 1)),
                    ],
                    [
                        'name' => $ageCategory->name . ' - ' . $weightCategory->label . ' (' . $firstAthlete->gender . ')',
                        'status' => 'pending',
                    ]
                );

                // Clear existing matches
                $group->matches()->delete();

                // Generate bracket structure using template
                $this->generateBracketStructure($group, $participants, $tournament);
            }

            Log::info("🎉 Bracket generation completed!");
        });
    }

    /**
     * Generates brackets using predefined templates.
     */
    protected function generateBracketStructure(CompetitionGroup $group, $participants, Tournament $tournament): void
    {
        $count = $participants->count();
        $bracketSize = $this->getNextPowerOfTwo($count);
        
        $templates = $this->getBracketTemplates();
        
        if (!isset($templates[$bracketSize])) {
            throw new \Exception("No template available for bracket size: {$bracketSize}");
        }
        
        $template = $templates[$bracketSize];
        $byeCount = $bracketSize - $count;
        
        Log::info("📊 Using template for {$bracketSize} slots - Participants: {$count}, BYEs: {$byeCount}, Rounds: {$template['rounds']}");
        
        // Create all matches based on template
        $allMatches = $this->createMatchesFromTemplate($group, $template, $tournament);
        
        // Seed participants into Round 1
        $this->seedParticipantsIntoTemplate($participants, $allMatches[1], $byeCount);
        
        // Process automatic BYE advancements
        $this->processTemplateAdvancements($allMatches, $template);
    }

    /**
     * Creates match structure from template.
     */
    protected function createMatchesFromTemplate(CompetitionGroup $group, array $template, Tournament $tournament): array
    {
        $allMatches = [];
        
        foreach ($template['structure'] as $round => $matchDefinitions) {
            $allMatches[$round] = [];
            
            foreach ($matchDefinitions as $matchDef) {
                $allMatches[$round][$matchDef['position']] = MatchEvent::create([
                    'competition_group_id' => $group->id,
                    'round' => $round,
                    'position' => $matchDef['position'],
                    'participant_a_id' => null,
                    'participant_b_id' => null,
                    'winner_id' => null,
                    'scheduled_at' => $tournament->start_date ?? now(),
                ]);
            }
        }
        
        return $allMatches;
    }

    /**
     * Seeds participants into Round 1 matches with proper BYE distribution.
     * BYEs are distributed at the bottom of the bracket (last matches).
     * Strategy: Fill complete matches first, then partial matches with BYEs.
     */
    protected function seedParticipantsIntoTemplate($participants, array $round1Matches, int $byeCount): void
    {
        $participantCount = $participants->count();
        $bracketSize = count($round1Matches) * 2;
        
        // Calculate how many matches we need
        $completeMatches = intdiv($participantCount, 2);
        $hasOddParticipant = $participantCount % 2 === 1;
        
        $participantIndex = 0;
        
        // Fill complete matches first (both participants)
        for ($i = 0; $i < $completeMatches; $i++) {
            if (isset($round1Matches[$i])) {
                $round1Matches[$i]->update([
                    'participant_a_id' => $participants[$participantIndex]->id,
                    'participant_b_id' => $participants[$participantIndex + 1]->id,
                ]);
                $participantIndex += 2;
            }
        }
        
        // If there's one remaining participant, give them a BYE
        if ($hasOddParticipant && isset($round1Matches[$completeMatches])) {
            $round1Matches[$completeMatches]->update([
                'participant_a_id' => $participants[$participantIndex]->id,
                'participant_b_id' => null, // This participant gets a BYE
            ]);
            $participantIndex++;
        }
        
        // Leave remaining matches completely empty (will not auto-advance)
        
        $totalMatchesUsed = $hasOddParticipant ? $completeMatches + 1 : $completeMatches;
        
        Log::info("✅ Seeded {$participantCount} participants into {$totalMatchesUsed} matches: " .
                  "{$completeMatches} complete matches" . 
                  ($hasOddParticipant ? ", 1 BYE match" : ""));
    }

    /**
     * Processes automatic advancements using template rules.
     * Only processes matches that have exactly one participant (true BYE scenarios).
     */
    protected function processTemplateAdvancements(array $allMatches, array $template): void
    {
        // Process rounds in order
        foreach ($template['structure'] as $roundNum => $matchDefinitions) {
            foreach ($matchDefinitions as $matchDef) {
                $match = $allMatches[$roundNum][$matchDef['position']];
                
                // Only auto-advance if there's exactly one participant (BYE scenario)
                $hasA = !is_null($match->participant_a_id);
                $hasB = !is_null($match->participant_b_id);
                
                // Skip matches with both participants (normal matches)
                if ($hasA && $hasB) {
                    continue;
                }
                
                // Skip matches with no participants (empty matches)
                if (!$hasA && !$hasB) {
                    continue;
                }
                
                // This is a true BYE - auto-advance
                $this->checkAndAutoAdvanceTemplate($match, $matchDef, $allMatches);
            }
        }
    }

    /**
     * Checks and auto-advances a match based on template rules.
     */
    protected function checkAndAutoAdvanceTemplate(MatchEvent $match, array $matchDef, array $allMatches): void
    {
        $hasA = !is_null($match->participant_a_id);
        $hasB = !is_null($match->participant_b_id);
        
        // Both participants exist - normal match
        if ($hasA && $hasB) {
            return;
        }
        
        // No participants - nothing to advance
        if (!$hasA && !$hasB) {
            return;
        }
        
        // Already has winner
        if ($match->winner_id) {
            return;
        }
        
        // Single participant - auto-advance (BYE)
        $winnerId = $hasA ? $match->participant_a_id : $match->participant_b_id;
        $match->update(['winner_id' => $winnerId]);
        
        Log::info("🚀 Auto-advanced participant {$winnerId} (BYE) in Round {$match->round}, Position {$match->position}");
        
        // Advance to next round using template rules
        $this->advanceWinnerUsingTemplate($match, $matchDef, $allMatches);
    }

    /**
     * Advances winner to next round using template's feed rules.
     */
    protected function advanceWinnerUsingTemplate(MatchEvent $match, array $matchDef, array $allMatches): void
    {
        if (!$match->winner_id || !$matchDef['feeds_to']) {
            return;
        }
        
        $feedInfo = $matchDef['feeds_to'];
        $nextRound = $feedInfo['round'];
        $nextPosition = $feedInfo['position'];
        $slot = $feedInfo['slot'] === 'a' ? 'participant_a_id' : 'participant_b_id';
        
        if (!isset($allMatches[$nextRound][$nextPosition])) {
            Log::info("🏆 Winner reached final! Participant {$match->winner_id}");
            return;
        }
        
        $nextMatch = $allMatches[$nextRound][$nextPosition];
        $nextMatch->update([$slot => $match->winner_id]);
        
        Log::info("➡️ Advanced participant {$match->winner_id} to Round {$nextRound}, Position {$nextPosition}, Slot: {$slot}");
        
        // Find the next match definition and check for auto-advance
        $templates = $this->getBracketTemplates();
        $bracketSize = $this->getNextPowerOfTwo(count($allMatches[1]) * 2);
        
        if (!isset($templates[$bracketSize])) {
            return;
        }
        
        $template = $templates[$bracketSize];
        
        $nextMatchDef = collect($template['structure'][$nextRound])
            ->firstWhere('position', $nextPosition);
        
        if ($nextMatchDef) {
            $this->checkAndAutoAdvanceTemplate($nextMatch, $nextMatchDef, $allMatches);
        }
    }

    /**
     * Advances winner after manual selection (called from controller).
     */
    public function advanceWinner(MatchEvent $match): void
    {
        if (!$match->winner_id) {
            return;
        }
        
        // Load template to get advancement rules
        $templates = $this->getBracketTemplates();
        $group = $match->competitionGroup;
        $totalMatches = $group->matches()->where('round', 1)->count();
        $bracketSize = $totalMatches * 2;
        
        if (!isset($templates[$bracketSize])) {
            Log::error("No template found for bracket size: {$bracketSize}");
            return;
        }
        
        $template = $templates[$bracketSize];
        $matchDef = collect($template['structure'][$match->round])
            ->firstWhere('position', $match->position);
        
        if (!$matchDef || !$matchDef['feeds_to']) {
            Log::info("🏆 Match is final - no further advancement");
            return;
        }
        
        $feedInfo = $matchDef['feeds_to'];
        $nextRound = $feedInfo['round'];
        $nextPosition = $feedInfo['position'];
        $slot = $feedInfo['slot'] === 'a' ? 'participant_a_id' : 'participant_b_id';
        
        $nextMatch = $group->matches()
            ->where('round', $nextRound)
            ->where('position', $nextPosition)
            ->first();
        
        if (!$nextMatch) {
            Log::info("🏆 Winner reached final! Participant {$match->winner_id}");
            return;
        }
        
        $nextMatch->update([$slot => $match->winner_id]);
        Log::info("➡️ Advanced participant {$match->winner_id} to Round {$nextRound}, Position {$nextPosition}");
        
        // Check if next match should auto-advance
        $nextMatchDef = collect($template['structure'][$nextRound])
            ->firstWhere('position', $nextPosition);
        
        if ($nextMatchDef) {
            // Load all matches for recursive advancement
            $allMatches = [];
            foreach ($template['structure'] as $r => $defs) {
                $allMatches[$r] = [];
                foreach ($defs as $def) {
                    $m = $group->matches()->where('round', $r)->where('position', $def['position'])->first();
                    if ($m) {
                        $allMatches[$r][$def['position']] = $m;
                    }
                }
            }
            $this->checkAndAutoAdvanceTemplate($nextMatch, $nextMatchDef, $allMatches);
        }
    }

    /**
     * Resets all brackets for a tournament.
     */
    public function reset(Tournament $tournament): void
    {
        DB::transaction(function () use ($tournament) {
            $tournament->competitionGroups()->each(function ($group) {
                $group->matches()->delete();
            });
            $tournament->competitionGroups()->delete();
            Log::info("🗑️ Reset all brackets for tournament: {$tournament->title}");
        });
    }

    /**
     * Gets the next power of 2 for bracket size.
     */
    protected function getNextPowerOfTwo(int $count): int
    {
        return pow(2, ceil(log($count, 2)));
    }
































    /**
 * Allows admin to manually update the winner of a match.
 * Automatically adjusts downstream matches accordingly.
 */
public function updateWinner(MatchEvent $match, int $newWinnerId): void
{
    DB::transaction(function () use ($match, $newWinnerId) {
        $oldWinnerId = $match->winner_id;
        
        // Update the winner in the current match
        $match->update(['winner_id' => $newWinnerId]);
        Log::info("✏️ Manually changed winner in Match {$match->id} (Round {$match->round}, Pos {$match->position}) from {$oldWinnerId} to {$newWinnerId}");
        
        // Load bracket template
        $templates = $this->getBracketTemplates();
        $group = $match->competitionGroup;
        $totalMatches = $group->matches()->where('round', 1)->count();
        $bracketSize = $totalMatches * 2;
        
        if (!isset($templates[$bracketSize])) {
            Log::error("No template found for bracket size: {$bracketSize}");
            return;
        }
        
        $template = $templates[$bracketSize];
        $matchDef = collect($template['structure'][$match->round])
            ->firstWhere('position', $match->position);
        
        if (!$matchDef || !$matchDef['feeds_to']) {
            Log::info("🏁 Match is final — updated winner only, no advancement");
            return;
        }

        // Determine feed info
        $feedInfo = $matchDef['feeds_to'];
        $nextRound = $feedInfo['round'];
        $nextPosition = $feedInfo['position'];
        $slot = $feedInfo['slot'] === 'a' ? 'participant_a_id' : 'participant_b_id';
        
        // Find next match
        $nextMatch = $group->matches()
            ->where('round', $nextRound)
            ->where('position', $nextPosition)
            ->first();
        
        if (!$nextMatch) {
            Log::info("🏆 Updated winner {$newWinnerId} reached final");
            return;
        }

        // 1️⃣ Remove old winner if they were previously advanced
        if ($oldWinnerId && ($nextMatch->participant_a_id === $oldWinnerId || $nextMatch->participant_b_id === $oldWinnerId)) {
            if ($nextMatch->participant_a_id === $oldWinnerId) {
                $nextMatch->update(['participant_a_id' => null]);
            }
            if ($nextMatch->participant_b_id === $oldWinnerId) {
                $nextMatch->update(['participant_b_id' => null]);
            }

            // Reset downstream winners (recursive cleanup)
            $this->resetDownstreamMatches($nextMatch, $template, $group);
        }

        // 2️⃣ Add new winner into the correct slot
        $nextMatch->update([$slot => $newWinnerId]);
        Log::info("➡️ New winner {$newWinnerId} advanced to Round {$nextRound}, Position {$nextPosition}");
        
        // 3️⃣ Auto-advance if next match now has a single participant
        $allMatches = $this->loadAllMatches($group, $template);
        $nextMatchDef = collect($template['structure'][$nextRound])
            ->firstWhere('position', $nextPosition);
        
        if ($nextMatchDef) {
            $this->checkAndAutoAdvanceTemplate($nextMatch, $nextMatchDef, $allMatches);
        }
    });

    
}




/**
 * Recursively resets downstream matches (clears winners and participants).
 */
protected function resetDownstreamMatches(MatchEvent $match, array $template, CompetitionGroup $group): void
{
    $matchDef = collect($template['structure'][$match->round])
        ->firstWhere('position', $match->position);
    
    if (!$matchDef || !$matchDef['feeds_to']) {
        return;
    }

    $feedInfo = $matchDef['feeds_to'];
    $nextMatch = $group->matches()
        ->where('round', $feedInfo['round'])
        ->where('position', $feedInfo['position'])
        ->first();

    if ($nextMatch) {
        // Reset winner & participants
        $nextMatch->update([
            'winner_id' => null,
            'participant_a_id' => null,
            'participant_b_id' => null,
        ]);

        Log::info("🧹 Cleared downstream match (Round {$nextMatch->round}, Position {$nextMatch->position}) due to winner change");

        // Recursive cleanup
        $this->resetDownstreamMatches($nextMatch, $template, $group);
    }
}
protected function loadAllMatches(CompetitionGroup $group, array $template): array
{
    $allMatches = [];
    foreach ($template['structure'] as $round => $defs) {
        $allMatches[$round] = [];
        foreach ($defs as $def) {
            $m = $group->matches()
                ->where('round', $round)
                ->where('position', $def['position'])
                ->first();
            if ($m) {
                $allMatches[$round][$def['position']] = $m;
            }
        }
    }
    return $allMatches;
}






}