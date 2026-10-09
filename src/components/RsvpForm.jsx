import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

/**
 * Client-side React RSVP Form Component
 *
 * Removes all server-side email sending logic (Resend, Formspree, SMTP, etc.).
 * On submission:
 *  1. Hides the input form
 *  2. Displays a Notification Banner at top with instructions to download/screenshot
 *  3. Displays a styled Data Summary Card summarizing submitted information
 *  4. Provides a "Download Confirmation" button using html2canvas to capture PNG image
 */
export default function RsvpForm() {
  const [formData, setFormData] = useState({
    name: '',
    plusOne: '',
    attending: '',
  });
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.attending) {
      setError('Please select whether you will be attending (Yes, joyfully! or No, regrettably.).');
      return;
    }

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Manila',
      dateStyle: 'medium',
      timeStyle: 'short',
    }) + ' (PST)';

    setSubmissionData({
      name: formData.name.trim(),
      plusOne: formData.plusOne.trim() || 'None specified',
      attending: formData.attending,
      timestamp,
    });

    setIsSubmitted(true);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      await new Promise((r) => setTimeout(r, 50));
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const image = canvas.toDataURL('image/png');

      const nameSlug = (submissionData?.name || 'Guest')
        .trim()
        .replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `RSVP_Confirmation_${nameSlug}.png`;

      let shared = false;
      try {
        const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
        if (blob && navigator.canShare) {
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'RSVP Confirmation',
              text: "RSVP Confirmation for Romnick & Sheila's Wedding",
            });
            shared = true;
          }
        }
      } catch (shareErr) {
        console.log('Native Web Share bypassed/canceled:', shareErr);
      }

      if (!shared) {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = image;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('[RSVP Download Error]:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100 font-serif">
      <h2 className="text-3xl font-bold text-center text-[#1D3557] mb-2 font-serif">RSVP</h2>
      <div className="w-16 h-0.5 bg-slate-300 mx-auto mb-6"></div>

      {!isSubmitted ? (
        <>
          <h3 className="text-xl font-semibold text-center text-slate-700 mb-2">
            Your presence will make our day even more special.
          </h3>
          <p className="italic text-center text-slate-500 mb-6 font-serif">
            Please let us know if you can make it.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 font-sans">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#62839b] text-[#1D3557] font-serif transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 font-sans">
                Plus One / Additional Guest (+)
              </label>
              <input
                type="text"
                value={formData.plusOne}
                onChange={(e) => setFormData({ ...formData, plusOne: e.target.value })}
                placeholder="Name of additional guest (or leave blank if none)"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-[#62839b] text-[#1D3557] font-serif transition-colors"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-widest text-center mb-3 font-sans">
                Will you be attending?
              </span>
              <div className="space-y-3 font-serif">
                <label
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.attending === 'Yes, joyfully!'
                      ? 'border-[#1D3557] bg-slate-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="Yes, joyfully!"
                    checked={formData.attending === 'Yes, joyfully!'}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                    className="w-4 h-4 text-[#1D3557] border-slate-300 focus:ring-[#1D3557]"
                  />
                  <span className="ml-3 text-lg font-medium text-[#1D3557]">Yes, joyfully!</span>
                </label>

                <label
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.attending === 'No, regrettably.'
                      ? 'border-[#1D3557] bg-slate-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="No, regrettably."
                    checked={formData.attending === 'No, regrettably.'}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                    className="w-4 h-4 text-[#1D3557] border-slate-300 focus:ring-[#1D3557]"
                  />
                  <span className="ml-3 text-lg font-medium text-[#1D3557]">No, regrettably.</span>
                </label>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-center text-sm font-medium pt-1 font-sans" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#1D3557] hover:bg-[#152742] text-white py-4 rounded-xl font-serif text-lg font-semibold tracking-wide shadow-md transition-colors duration-200"
            >
              Send RSVP
            </button>
          </form>
        </>
      ) : (
        <div className="space-y-6">
          {/* Notification Banner */}
          <div className="bg-amber-50 border-2 border-amber-400 text-amber-900 rounded-xl p-4 text-center font-sans font-semibold text-sm shadow-sm leading-relaxed">
            ⚠️ IMPORTANT: Please download or screenshot this confirmation and send it directly to the host to secure your RSVP.
          </div>

          {/* Data Summary Card */}
          <div
            ref={cardRef}
            className="bg-white border border-[#d0e1fd] rounded-2xl p-6 text-left space-y-4 shadow-md"
          >
            <div className="border-b border-slate-200 pb-4 text-center">
              <span className="text-xs uppercase tracking-widest text-[#62839b] font-sans font-semibold">
                Official RSVP Receipt
              </span>
              <h4 className="text-2xl font-bold text-[#1D3557] font-serif mt-1">
                Romnick & Sheila's Wedding
              </h4>
              <p className="text-sm text-slate-500 italic mt-0.5">December 27, 2026 • 2:00 PM</p>
            </div>

            <div className="space-y-3 font-sans">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 text-sm font-medium">Guest Name:</span>
                <span className="text-[#1D3557] font-bold text-base font-serif text-right">
                  {submissionData.name}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 text-sm font-medium">Plus One / Guest:</span>
                <span className="text-slate-800 font-semibold text-sm text-right">
                  {submissionData.plusOne}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 text-sm font-medium">Attendance Status:</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    submissionData.attending.toLowerCase().includes('yes')
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {submissionData.attending.toLowerCase().includes('yes') ? '✓ ' : '✗ '}
                  {submissionData.attending}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 text-xs">Submitted On:</span>
                <span className="text-slate-500 text-xs font-mono">{submissionData.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-[#1D3557] hover:bg-[#152742] text-white py-3.5 px-6 rounded-xl font-serif text-base font-semibold shadow-md transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>{isDownloading ? 'Generating Image...' : 'Download Confirmation'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
