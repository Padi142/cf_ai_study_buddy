"use client";

import { Github } from "lucide-react";

export function GithubLink() {
  return (
    <a
      href="https://github.com/Padi142/cf_ai_study_buddy"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
    >
      <Github className="h-5 w-5" />
      <span>View on GitHub</span>
    </a>
  );
}
