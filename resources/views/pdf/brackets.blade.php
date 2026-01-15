<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { 
            margin: 80px 40px 60px 40px;
            size: landscape;
        }
        
        body { 
            font-family: DejaVu Sans, sans-serif; 
            font-size: 11px;
            color: #333;
        }

        header {
            position: fixed;
            top: -60px;
            left: 0;
            right: 0;
            height: 60px;
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        
        footer {
            position: fixed;
            bottom: -50px;
            left: 0;
            right: 0;
            height: 40px;
            text-align: center;
            border-top: 1px solid #aaa;
            font-size: 9px;
            color: #666;
            padding-top: 10px;
        }

        .header-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #000;
        }

        .header-subtitle {
            font-size: 12px;
            color: #555;
        }

        .bracket-page {
            page-break-after: always;
            page-break-inside: avoid;
        }

        .group-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20px;
            padding-bottom: 8px;
            border-bottom: 2px solid #333;
            color: #000;
        }

        .bracket-container {
            display: table;
            width: 100%;
            table-layout: fixed;
            margin-top: 20px;
        }

        .round-column {
            display: table-cell;
            vertical-align: top;
            padding: 0 15px;
        }

        .round-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
            font-size: 13px;
            text-transform: uppercase;
            color: #000;
            letter-spacing: 0.5px;
        }

        .round-matches {
            display: flex;
            flex-direction: column;
        }

        .match-box {
            border: 1.5px solid #666;
            border-radius: 5px;
            margin: 8px 0;
            padding: 8px 10px;
            background-color: #fafafa;
            min-height: 50px;
        }

        .participant {
            padding: 4px 0;
            font-size: 11px;
            border-bottom: 1px dashed #ccc;
        }

        .participant:last-child {
            border-bottom: none;
        }

        .participant-winner {
            background-color: #d4f4dd;
            font-weight: bold;
            padding: 4px 6px;
            margin: -2px -4px;
            border-radius: 3px;
        }

        .participant-bye {
            color: #999;
            font-style: italic;
        }

        .participant-tbd {
            color: #aaa;
            font-style: italic;
        }

        .vs-separator {
            text-align: center;
            color: #999;
            font-size: 9px;
            padding: 2px 0;
        }

        .winner-mark {
            color: #28a745;
            font-weight: bold;
            font-size: 14px;
        }

        .round-1 .match-box { margin: 8px 0; }
        .round-2 .match-box { margin: 20px 0; }
        .round-3 .match-box { margin: 44px 0; }
        .round-4 .match-box { margin: 92px 0; }
        .round-5 .match-box { margin: 188px 0; }

        .no-brackets {
            text-align: center;
            padding: 60px 20px;
            color: #999;
            font-style: italic;
        }
    </style>
</head>
<body>
<header>
    <div class="header-title">{{ $tournament->title }}</div>
    <div class="header-subtitle">Tournament Brackets - {{ now()->format('F d, Y') }}</div>
</header>

<footer>
    <div>Generated: {{ now()->format('Y-m-d H:i') }} | Page <span class="pagenum"></span></div>
</footer>

<main>
    @if($groups->isEmpty())
        <div class="no-brackets">
            <h2>No brackets generated yet</h2>
            <p>Please generate brackets from the admin panel</p>
        </div>
    @else
        @foreach($groups as $groupIndex => $group)
            <div class="bracket-page">
                <div class="group-title">{{ $group['name'] }}</div>

                @php
                    // Organize matches by round
                    $matchesByRound = $group['matches']->groupBy('round')->sortKeys();
                    $totalRounds = $matchesByRound->keys()->max();
                @endphp

                <div class="bracket-container">
                    @foreach($matchesByRound as $roundNum => $matches)
                        <div class="round-column">
                            <div class="round-title">
                                @if($roundNum == $totalRounds)
                                    🏆 Final
                                @else
                                    Round {{ $roundNum }}
                                @endif
                            </div>
                            
                            <div class="round-matches round-{{ $roundNum }}">
                                @foreach($matches->sortBy('position') as $match)
                                    <div class="match-box">
                                        @php
                                            $hasA = !is_null($match['participant_a']);
                                            $hasB = !is_null($match['participant_b']);
                                            $winnerId = $match['winner_id'];
                                            
                                            $participantAName = $hasA 
                                                ? $match['participant_a']['first_name'] . ' ' . $match['participant_a']['last_name']
                                                : ($hasB ? 'TBD' : 'BYE');
                                            
                                            $participantBName = $hasB 
                                                ? $match['participant_b']['first_name'] . ' ' . $match['participant_b']['last_name']
                                                : ($hasA ? 'TBD' : 'BYE');
                                            
                                            $isAWinner = $hasA && $winnerId == $match['participant_a']['id'];
                                            $isBWinner = $hasB && $winnerId == $match['participant_b']['id'];
                                        @endphp

                                        <div class="participant {{ !$hasA ? 'participant-' . ($hasB ? 'tbd' : 'bye') : '' }} {{ $isAWinner ? 'participant-winner' : '' }}">
                                            {{ $participantAName }}
                                            @if($isAWinner)
                                                <span class="winner-mark">✓</span>
                                            @endif
                                        </div>
                                        
                                        <div class="vs-separator">vs</div>
                                        
                                        <div class="participant {{ !$hasB ? 'participant-' . ($hasA ? 'tbd' : 'bye') : '' }} {{ $isBWinner ? 'participant-winner' : '' }}">
                                            {{ $participantBName }}
                                            @if($isBWinner)
                                                <span class="winner-mark">✓</span>
                                            @endif
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        @endforeach
    @endif
</main>

<!-- <script type="text/php">
    if (isset($pdf)) {
        $text = "Page {PAGE_NUM} of {PAGE_COUNT}";
        $size = 9;
        $font = $fontMetrics->getFont("DejaVu Sans");
        $width = $fontMetrics->get_text_width($text, $font, $size) / 2;
        $x = ($pdf->get_width() - $width) / 2;
        $y = $pdf->get_height() - 40;
        $pdf->page_text($x, $y, $text, $font, $size);
    }
</script> -->


<script type="text/javascript">
  // Assuming you have jsPDF library included

  // Create a new PDF document
  var doc = new jsPDF();

  // Define the PHP variables and values
  var text = "Page {PAGE_NUM} of {PAGE_COUNT}";
  var size = 9;
  var font = "DejaVu Sans";
  var width = doc.internal.pageSize.width;
  var x = width / 2;
  var y = doc.internal.pageSize.height - 40;

  // Add the text to the PDF
  doc.setFont(font);
  doc.setFontSize(size);
  doc.text(text, x, y);

  // Output the PDF as a blob
  doc.save("output.pdf");
</script>
</body>
</html>