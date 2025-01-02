import React, { useState, useEffect } from 'react';
import SetUpEmailCustom from '../ccomponents/SetupEmailCustom'; // Correct path to the component

const CustomTemplateForm = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true); // Set the form as submitted
  };

  // Log subject and body when the form is submitted
  useEffect(() => {
    if (isFormSubmitted) {
      console.log("Form submitted with Subject:", subject, "and Body:", body);
    }
  }, [isFormSubmitted, subject, body]);

  return (
    <div className="custom-template">
      {!isFormSubmitted ? (
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card bg-dark text-white p-4">
                <h3 className="text-center mb-4">Enter Your Custom Email Template</h3>

                <form onSubmit={handleFormSubmit} className="custom-email-form">
                  <div className="form-group mb-3">
                    <label htmlFor="subject" className="form-label">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="form-control"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter your email subject"
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="body" className="form-label">
                      Body
                    </label>
                    <textarea
                      id="body"
                      className="form-control"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Enter your email body content"
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-3"
                    disabled={subject === '' || body === ''}
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-center">
          {/* Pass the subject and body as props to the next component */}
          <SetUpEmailCustom subject={subject} body={body} />
        </div>
      )}
    </div>
  );
};

export default CustomTemplateForm;
