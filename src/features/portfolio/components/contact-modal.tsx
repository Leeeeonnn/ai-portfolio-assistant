"use client";

import Image from "next/image";
import { figmaAssets } from "@/features/portfolio/data";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="figma-contact-backdrop"
      onMouseDown={onClose}
      role="dialog"
    >
      <section
        className="figma-contact-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2>联系我</h2>
        <p>电话: 13716937708</p>
        <p>邮箱: lewuyiao@gmail.com</p>
        <Image
          alt="联系二维码"
          className="figma-contact-qr"
          height={60}
          src={figmaAssets.contactQr}
          width={60}
        />
        <Image
          alt=""
          className="figma-contact-avatar"
          height={192}
          src={figmaAssets.contactAvatar}
          width={192}
        />
      </section>
    </div>
  );
}
