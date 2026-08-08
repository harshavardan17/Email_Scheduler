const fs = require('fs');
const path = require('path');

async function main() {
  const filePath = path.resolve('emails.csv');
  const fileBuffer = fs.readFileSync(filePath);
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer], { type: 'text/csv' }), 'emails.csv');

  const uploadRes = await fetch('http://localhost:5000/api/uploads', {
    method: 'POST',
    body: formData,
  });

  const uploadData = await uploadRes.json();
  console.log('UPLOAD', uploadRes.status, JSON.stringify(uploadData));

  const recipients = uploadData.emails || [];
  const startTime = new Date(Date.now() + 45_000).toISOString();

  const scheduleRes = await fetch('http://localhost:5000/api/emails/schedule-bulk', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      recipients,
      subject: 'Test schedule',
      body: 'This is a verification',
      startTime,
      delayBetweenEmails: 5,
      hourlyLimit: 100,
    }),
  });

  const scheduleData = await scheduleRes.json();
  console.log('SCHEDULE', scheduleRes.status, JSON.stringify(scheduleData, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
