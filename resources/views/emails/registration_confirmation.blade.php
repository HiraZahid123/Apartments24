<!DOCTYPE html>
<html>
<head>
    <title>Event Registration Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.5;">

    <h1>Thank you for registering!</h1>

    <!-- Verification Code at the Top -->
    <h2 style="color: #1d4ed8;">Your Verification Code: {{ $registration->email_verification_code }}</h2>
    <p>Please use this code to verify your email and complete your registration.</p>

    <hr style="margin: 20px 0;">

    <h2>Event Details</h2>
    <p><strong>Title:</strong> {{ $event->title }}</p>
    <p><strong>Start:</strong> {{ $event->starts_at->format('d M Y H:i') }}</p>
    <p><strong>End:</strong> {{ $event->ends_at->format('d M Y H:i') }}</p>
    @if($event->registration_deadline)
        <p><strong>Registration Deadline:</strong> {{ $event->registration_deadline->format('d M Y H:i') }}</p>
    @endif
    @if($event->organizer)
        <p><strong>Organizer:</strong> {{ $event->organizer }}</p>
    @endif
    @if($event->contact)
        <p><strong>Contact:</strong> {{ $event->contact }}</p>
    @endif
    @if($event->pdf_path)
        <p><a href="{{ asset('storage/' . $event->pdf_path) }}">Download Event PDF</a></p>
    @endif

    <hr style="margin: 20px 0;">

    <h2>Participant Details</h2>
    <p><strong>Full Name:</strong> {{ $registration->full_name }}</p>
    <p><strong>Email:</strong> {{ $registration->email }}</p>

    @if(!empty($registration->responses))
        <h3>Form Responses:</h3>
        <ul>
        @foreach($registration->responses as $key => $value)
            <li><strong>{{ $key }}:</strong> {{ $value }}</li>
        @endforeach
        </ul>
    @endif

    <hr style="margin: 20px 0;">

    <h2>Payment Information</h2>
    <p><strong>Status:</strong> {{ $registration->paid ? 'Paid' : 'Pending' }}</p>
    @if($event->price)
        <p><strong>Amount:</strong> {{ $event->price }} EUR</p>
    @endif

    <p>We look forward to seeing you at the event!</p>

</body>
</html>
