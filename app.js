document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Create a FormData object to send the form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);

    // Send email with form data to the company's email address
    fetch('/send-email', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Send confirmation email to the user's email address
            fetch('/send-confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => {
                if (response.ok) {
                    // Display SweetAlert
                    const toast = Swal.mixin({
                        toast: true,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });

                    toast.fire({
                        icon: 'success',
                        title: 'Thank you for your feedback!',
                        text: 'We will get to it as soon as possible.'
                    });

                    // Reset form fields
                    document.getElementById('contactForm').reset();
                } else {
                    // Handle error
                    console.error('Error sending confirmation email');
                }
            })
            .catch(error => {
                // Handle error
                console.error('Error sending confirmation email:', error);
            });
        } else {
            // Handle error
            console.error('Error sending email');
        }
    })
    .catch(error => {
        // Handle error
        console.error('Error sending email:', error);
    });
});