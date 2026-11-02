// Wait until the page is fully loaded before running anything
$(document).ready(function () {

  // ---- Only allow digits in the phone box ----
  $('#phone').on('input', function () {
    this.value = this.value.replace(/\D/g, '');
  });

  // ---- Small helpers to show / clear error messages ----
  function showError(field, message) {
    $('#' + field).addClass('invalid');
    $('#err-' + field).text(message);
  }
  function clearErrors() {
    $('input, select').removeClass('invalid');
    $('.error').text('');
    $('#serverError').text('');
  }

  // ---- Client-side validation (returns true if everything is fine) ----
  function validate() {
    var ok = true;
    var name  = $.trim($('#name').val());
    var sem   = $('#sem').val();
    var div   = $('#division').val();
    var cgpa  = $.trim($('#cgpa').val());
    var phone = $('#phone').val();

    if (!/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(name)) { showError('name', 'Enter a valid name (letters only).'); ok = false; }
    if (sem === '')  { showError('sem', 'Pick a semester.'); ok = false; }
    if (div === '')  { showError('division', 'Pick a division.'); ok = false; }
    if (!/^\d{1,2}(\.\d{1,2})?$/.test(cgpa) || parseFloat(cgpa) > 10) { showError('cgpa', 'Enter a CGPA between 0 and 10.'); ok = false; }
    if (!/^[6-9]\d{9}$/.test(phone)) { showError('phone', 'Enter a valid 10-digit mobile number.'); ok = false; }

    return ok;
  }

  // ---- When the form is submitted (button click) ----
  $('#regForm').on('submit', function (e) {
    e.preventDefault();          // stop the normal page reload
    clearErrors();

    if (!validate()) { return; } // stop if something is wrong

    $('#submitBtn').prop('disabled', true).text('Submitting...');

    // Send the data to PHP using jQuery AJAX
    $.ajax({
      url: 'submit.php',
      method: 'POST',
      data: $(this).serialize(), // name=...&sem=...&etc
      dataType: 'json'
    })
    .done(function (res) {
      if (res.success) {
        // Fill the result card. .text() is used so nothing can inject HTML.
        $('#r-name').text(res.data.name);
        $('#r-sem').text(res.data.sem);
        $('#r-division').text(res.data.division);
        $('#r-cgpa').text(res.data.cgpa);
        $('#r-phone').text(res.data.phone);
        $('#r-time').text(res.data.time);

        // Hide the form, show the result
        $('#regForm').hide();
        $('#result').removeClass('hidden');
      } else {
        // PHP found a problem - show each message under its field
        $.each(res.errors, function (field, msg) { showError(field, msg); });
      }
    })
    .fail(function () {
      $('#serverError').text('Could not reach the server. Please try again.');
    })
    .always(function () {
      $('#submitBtn').prop('disabled', false).text('Register');
    });
  });

  // ---- "Register another student" button: reset everything ----
  $('#newBtn').on('click', function () {
    $('#regForm')[0].reset();
    clearErrors();
    $('#result').addClass('hidden');
    $('#regForm').show();
  });

});
