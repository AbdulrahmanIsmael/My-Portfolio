"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";

import { I_appStore } from "@/stores/types/appStore-types";
import Link from "next/link";
import Title from "@/components/ui/Title";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import useAppStore from "@/stores/store";
import { useState } from "react";
import { useTranslations } from "next-intl";

const Contact = () => {
  const { arabicLang, lightMode } = useAppStore((state) => state as I_appStore);
  const contactMessages = useTranslations(
    `Portfolio.Contact.${arabicLang ? "ar" : "en"}`
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const contactDetails = [
    {
      icon: HiMail,
      label: contactMessages("email"),
      value: "abdulrahmanismael2023@gmail.com",
      href: "mailto:abdulrahmanismael2023@gmail.com",
    },
    {
      icon: HiPhone,
      label: contactMessages("phone"),
      value: "+20 111 459 6793",
      href: "tel:+201114596793",
    },
    {
      icon: HiLocationMarker,
      label: contactMessages("location"),
      value: "Cairo, Egypt",
      href: null,
    },
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      label: "GitHub",
      href: "https://github.com/AbdulrahmanIsmael",
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/abdulrahmanismael",
    },
  ];

  const reasons = [
    { value: "", label: contactMessages("reasonPlaceholder") },
    { value: "job", label: contactMessages("reasonJob") },
    { value: "freelance", label: contactMessages("reasonFreelance") },
    { value: "collaboration", label: contactMessages("reasonCollaboration") },
    { value: "question", label: contactMessages("reasonQuestion") },
    { value: "other", label: contactMessages("reasonOther") },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    // Get credentials from environment variables
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

    const templateParams = {
      from_name: formData.name,
      user_email: formData.email || "Not provided",
      user_phone: formData.phone || "Not provided",
      reason: formData.reason,
      message: formData.message,
      to_name: "Abdulrahman Ismael", // Your name
    };

    try {
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log("Email sent successfully!", response.status, response.text);

      setSubmitStatus({
        type: "success",
        message: contactMessages("successMessage"),
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        reason: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      setSubmitStatus({
        type: "error",
        message: contactMessages("errorMessage"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto flex flex-col gap-5">
        <Title
          subtitle={contactMessages("subTitle")}
          align={arabicLang ? "right" : "left"}
        >
          {contactMessages("title")}
        </Title>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Box - Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: arabicLang ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`
              p-8 rounded-xl backdrop-blur-sm h-fit
              ${
                lightMode
                  ? "bg-primaryDark text-textDark"
                  : "bg-primaryLight text-textLight"
              }
              ${
                lightMode
                  ? "shadow-lg shadow-subtleDark/20"
                  : "shadow-lg shadow-subtleLight/20"
              }
              border ${
                lightMode ? "border-subtleDark/30" : "border-subtleLight/30"
              }
            `}
          >
            <h3 className="text-2xl font-bold mb-6">
              {contactMessages("detailsTitle")}
            </h3>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              {contactDetails.map((contact, index) => (
                <motion.div
                  key={contact.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`
                      p-3 rounded-lg
                      ${
                        lightMode
                          ? "bg-accentDark/20 text-accentDark"
                          : "bg-accentLight/20 text-accentLight"
                      }
                    `}
                  >
                    <contact.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium ${
                        lightMode ? "text-textDark/60" : "text-textLight/60"
                      }`}
                    >
                      {contact.label}
                    </p>
                    {contact.href ? (
                      <Link
                        href={contact.href}
                        className={`text-sm font-medium transition-colors ${
                          lightMode
                            ? "hover:text-accentDark"
                            : "hover:text-accentLight"
                        }`}
                      >
                        {contact.value}
                      </Link>
                    ) : (
                      <p className="text-sm font-medium">{contact.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {contactMessages("socialTitle")}
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      p-3 rounded-lg transition-colors
                      ${
                        lightMode
                          ? "bg-primaryLight/10 hover:bg-accentDark/20 text-textDark hover:text-accentDark"
                          : "bg-primaryDark/10 hover:bg-accentLight/20 text-textLight hover:text-accentLight"
                      }
                    `}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Box - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: arabicLang ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`
              p-8 rounded-xl backdrop-blur-sm
              ${
                lightMode
                  ? "bg-primaryDark text-textDark"
                  : "bg-primaryLight text-textLight"
              }
              ${
                lightMode
                  ? "shadow-lg shadow-subtleDark/20"
                  : "shadow-lg shadow-subtleLight/20"
              }
              border ${
                lightMode ? "border-subtleDark/30" : "border-subtleLight/30"
              }
            `}
          >
            <h3 className="text-2xl font-bold mb-6">
              {contactMessages("formTitle")}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  {contactMessages("nameLabel")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`
                    w-full px-4 py-3 rounded-lg outline-none transition-all
                    ${
                      lightMode
                        ? "bg-primaryLight/10 border border-subtleDark/30 focus:border-accentDark"
                        : "bg-primaryDark/10 border border-subtleLight/30 focus:border-accentLight"
                    }
                  `}
                  placeholder={contactMessages("namePlaceholder")}
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  {contactMessages("emailLabel")}{" "}
                  <span
                    className={`text-xs ${
                      lightMode ? "text-textDark/60" : "text-textLight/60"
                    }`}
                  >
                    ({contactMessages("optional")})
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg outline-none transition-all
                    ${
                      lightMode
                        ? "bg-primaryLight/10 border border-subtleDark/30 focus:border-accentDark"
                        : "bg-primaryDark/10 border border-subtleLight/30 focus:border-accentLight"
                    }
                  `}
                  placeholder={contactMessages("emailPlaceholder")}
                />
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2"
                >
                  {contactMessages("phoneLabel")}{" "}
                  <span
                    className={`text-xs ${
                      lightMode ? "text-textDark/60" : "text-textLight/60"
                    }`}
                  >
                    ({contactMessages("optional")})
                  </span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg outline-none transition-all
                    ${
                      lightMode
                        ? "bg-primaryLight/10 border border-subtleDark/30 focus:border-accentDark"
                        : "bg-primaryDark/10 border border-subtleLight/30 focus:border-accentLight"
                    }
                  `}
                  placeholder={contactMessages("phonePlaceholder")}
                />
              </div>

              {/* Reason Select */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium mb-2"
                >
                  {contactMessages("reasonLabel")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className={`
                    w-full px-4 py-3 rounded-lg outline-none transition-all
                    ${
                      lightMode
                        ? "bg-primaryLight/10 border border-subtleDark/30 focus:border-accentDark"
                        : "bg-primaryDark/10 border border-subtleLight/30 focus:border-accentLight"
                    }
                  `}
                >
                  {reasons.map((reason) => (
                    <option
                      key={reason.value}
                      value={reason.value}
                      className={
                        lightMode ? "bg-primaryDark" : "bg-primaryLight"
                      }
                    >
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  {contactMessages("messageLabel")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`
                    w-full px-4 py-3 rounded-lg outline-none transition-all resize-none
                    ${
                      lightMode
                        ? "bg-primaryLight/10 border border-subtleDark/30 focus:border-accentDark"
                        : "bg-primaryDark/10 border border-subtleLight/30 focus:border-accentLight"
                    }
                  `}
                  placeholder={contactMessages("messagePlaceholder")}
                />
              </div>

              {/* Submit Status */}
              {submitStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    p-4 rounded-lg text-sm
                    ${
                      submitStatus.type === "success"
                        ? lightMode
                          ? "bg-green-500/20 text-green-400"
                          : "bg-green-500/20 text-green-600"
                        : lightMode
                        ? "bg-red-500/20 text-red-400"
                        : "bg-red-500/20 text-red-600"
                    }
                  `}
                >
                  {submitStatus.message}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  cursor-pointer w-full py-4 rounded-lg font-semibold text-base transition-all
                  ${
                    lightMode
                      ? "bg-accentDark hover:bg-accentHoverDark text-primaryDark"
                      : "bg-accentLight hover:bg-accentHoverLight text-primaryLight"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg hover:shadow-xl
                `}
              >
                {isSubmitting
                  ? contactMessages("sending")
                  : contactMessages("send")}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
