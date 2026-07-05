import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Mail, MapPin, Send, Loader2, CheckCircle2, Phone, Linkedin, MessageSquare, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Reveal from '../UI/Reveal';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' })
});

/**
 * Contact: Secure contact terminal panel.
 * Re-themed to Minimal Premium Monochrome.
 */
const Contact = ({ settings }) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await axios.post('/contact', data);
      if (res.data.success) {
        toast.success('Message synchronized successfully.');
        setSubmitted(true);
        reset();
      } else {
        toast.error('Message failed to send. Please try WhatsApp/email directly.');
      }
    } catch (error) {
      toast.error('Message failed to send. Please try WhatsApp/email directly.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 border-t border-white/[0.08]">
      <div className="space-y-12">
        
        {/* Title */}
        <div className="flex items-center space-x-4 text-left">
          <h2 className="text-3xl font-bold tracking-tight font-heading text-white">Get In Touch</h2>
          <div className="h-[1px] bg-gradient-to-r from-white/20 to-transparent flex-grow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          
          {/* Info Details */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Let's talk about your project</h3>
                <p className="text-sm leading-relaxed text-[#b5b5b5] font-light font-sans">
                  Feel free to send a message. I'm always open to discussing new projects, research ideas, or opportunities to collaborate.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-4">
                {settings?.contactEmail && (
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-[#101010]/80 backdrop-blur-md">
                    <span className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white shrink-0">
                      <Mail className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-xs text-gray-500 font-mono">Email Me</p>
                      <a href={`mailto:${settings.contactEmail}`} className="text-sm font-semibold hover:text-white transition-colors">
                        {settings.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-[#101010]/80 backdrop-blur-md">
                  <span className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white shrink-0">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-500 font-mono">Based In</p>
                    <p className="text-sm font-semibold">India (Remote/Hybrid)</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-[#101010]/80 backdrop-blur-md">
                  <span className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white shrink-0">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-500 font-mono">Call Me</p>
                    <a href="tel:+917067655707" className="text-sm font-semibold hover:text-[#d4af37] transition-colors">
                      +91 70676 55707
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="space-y-4 pt-2">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Direct Channels</p>
                <div className="flex items-center space-x-3.5 pt-1">
                  
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/917067655707?text=Hi%20Yatnesh%2C%20I%20saw%20your%20portfolio..."
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/45 hover:bg-[#d4af37]/5 transition-all cursor-pointer"
                    title="Chat on WhatsApp"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/yatneshpuranik"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/45 hover:bg-[#d4af37]/5 transition-all cursor-pointer"
                    title="Connect on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>

                  {/* SMS */}
                  <a
                    href="sms:+917067655707"
                    className="p-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/45 hover:bg-[#d4af37]/5 transition-all cursor-pointer"
                    title="Send SMS"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:+917067655707"
                    className="p-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37]/45 hover:bg-[#d4af37]/5 transition-all cursor-pointer"
                    title="Call Phone"
                  >
                    <Phone className="w-5 h-5" />
                  </a>

                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.2}>
              <div className="p-6 md:p-8 rounded-xl border border-white/[0.08] bg-[#101010]/80 backdrop-blur-md shadow-2xl">
                {submitted ? (
                  <div className="text-center py-8 space-y-4 font-sans">
                    <div className="flex justify-center">
                      <CheckCircle2 className="w-16 h-16 text-white animate-bounce" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-heading">Message Sent!</h3>
                    <p className="text-sm text-[#b5b5b5] max-w-sm mx-auto font-sans font-light">
                      Thank you for reaching out. I have received your email alert and will get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer font-mono shadow-md"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-heading">Your Name</label>
                      <input
                        type="text"
                        {...register('name')}
                        className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-[#050505] text-white focus:outline-none focus:border-white/50 focus:shadow-[0_0_8px_rgba(255,255,255,0.04)] transition-all font-sans
                          ${errors.name ? 'border-red-500' : 'border-white/[0.08]'}
                        `}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-xs text-red-500 font-medium font-sans">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-heading">Email Address</label>
                      <input
                        type="email"
                        {...register('email')}
                        className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-[#050505] text-white focus:outline-none focus:border-white/50 focus:shadow-[0_0_8px_rgba(255,255,255,0.04)] transition-all font-sans
                          ${errors.email ? 'border-red-500' : 'border-white/[0.08]'}
                        `}
                        placeholder="johndoe@example.com"
                      />
                      {errors.email && <p className="text-xs text-red-500 font-medium font-sans">{errors.email.message}</p>}
                    </div>

                    {/* Subject */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-heading">Subject</label>
                      <input
                        type="text"
                        {...register('subject')}
                        className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-[#050505] text-white focus:outline-none focus:border-white/50 focus:shadow-[0_0_8px_rgba(255,255,255,0.04)] transition-all font-sans
                          ${errors.subject ? 'border-red-500' : 'border-white/[0.08]'}
                        `}
                        placeholder="Collaboration opportunity"
                      />
                      {errors.subject && <p className="text-xs text-red-500 font-medium font-sans">{errors.subject.message}</p>}
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-heading">Message</label>
                      <textarea
                        rows="5"
                        {...register('message')}
                        className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-[#050505] text-white focus:outline-none focus:border-white/50 focus:shadow-[0_0_8px_rgba(255,255,255,0.04)] transition-all resize-none font-sans
                          ${errors.message ? 'border-red-500' : 'border-white/[0.08]'}
                        `}
                        placeholder="Detail your message here..."
                      />
                      {errors.message && <p className="text-xs text-red-500 font-medium font-sans">{errors.message.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-white text-black font-bold font-mono uppercase tracking-widest hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-75 cursor-pointer shadow-md"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-black" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>

                  </form>
                )}
              </div>
            </Reveal>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
