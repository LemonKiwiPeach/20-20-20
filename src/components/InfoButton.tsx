import React, { useState } from 'react';
import '../styles/InfoButton.css';

function InfoButton() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <button className="info-button" onClick={() => setDialogOpen(true)}>
        i
      </button>
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2>20-20-20 Rule</h2>
            <p>
              The 20-20-20 rule is a simple guideline to reduce eye strain when using screens, like computers or smartphones:
              <br />
              <br />
              1. Every 20 minutes.
              <br />
              2. Look at something 20 feet away.
              <br />
              3. For at least 20 seconds.
              <br />
              <br />
              In essence, it's a reminder to take regular short breaks and focus on distant objects to give your eyes a rest when using screens for extended periods.
            </p>
            <button className="close-button" onClick={() => setDialogOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoButton;
