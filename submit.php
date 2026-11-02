<?php
// submit.php - receives the form data, validates it, sends back JSON

header('Content-Type: application/json');

// Only accept POST requests (not someone just opening the URL)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'errors' => ['name' => 'Invalid request.']]);
    exit;
}

// Read the values and trim extra spaces (empty string if missing)
$name     = trim($_POST['name']     ?? '');
$sem      = trim($_POST['sem']      ?? '');
$division = trim($_POST['division'] ?? '');
$cgpa     = trim($_POST['cgpa']     ?? '');
$phone    = trim($_POST['phone']    ?? '');

$errors = [];   // we collect all problems here

// Name: letters, spaces, dots, apostrophes, hyphens (2 to 50 characters)
if (!preg_match("/^[A-Za-z][A-Za-z .'-]{1,49}$/", $name)) {
    $errors['name'] = 'Enter a valid name (letters only).';
}

// Semester must be a number from 1 to 8
if (!ctype_digit($sem) || (int)$sem < 1 || (int)$sem > 8) {
    $errors['sem'] = 'Semester must be between 1 and 8.';
}

// Division must be one of A-D
if (!in_array($division, ['A', 'B', 'C', 'D'], true)) {
    $errors['division'] = 'Choose a valid division.';
}

// CGPA: number like 8 or 8.45, max 10
if (!preg_match('/^\d{1,2}(\.\d{1,2})?$/', $cgpa) || (float)$cgpa > 10) {
    $errors['cgpa'] = 'CGPA must be between 0 and 10.';
}

// Phone: exactly 10 digits, starting with 6-9 (Indian mobile format)
if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
    $errors['phone'] = 'Enter a valid 10-digit mobile number.';
}

// If anything failed, send the errors back and stop
if (!empty($errors)) {
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Everything is valid - send the data back for display.
// (We are not saving to a database here; you can add MySQL later.)
echo json_encode([
    'success' => true,
    'data' => [
        'name'     => $name,
        'sem'      => $sem,
        'division' => $division,
        'cgpa'     => number_format((float)$cgpa, 2),
        'phone'    => $phone,
        'time'     => date('d M Y, h:i A')
    ]
]);
