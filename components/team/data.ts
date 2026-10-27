// All text and members for the Team section. Change them here, not in the component.

export const TEAM_COPY = {
  label: "Our Team",
  heading: "Meet The Minds",
  headingLine2: "Behind", // white part of line 2
  headingAccent: "ZYREX", // gold word at the end of line 2
};

// Placeholder photos (pravatar.cc). Replace with real photos later, e.g. "/team/matt.jpg" in /public/team.
const face = (n: number) => `https://i.pravatar.cc/800?img=${n}`;

export const TEAM = [
  { name: "Matt Smith", role: "Co-Founder", photo: face(12) },
  { name: "Daniel Reed", role: "Creative Director", photo: face(33) },
  { name: "Sarah Khan", role: "Head of Strategy", photo: face(47) },
  { name: "Ali Raza", role: "Lead Developer", photo: face(59) },
  { name: "Emma Clarke", role: "Marketing Lead", photo: face(44) },
  { name: "Omar Malik", role: "Automation Expert", photo: face(53) },
  { name: "Lena Brooks", role: "UI/UX Designer", photo: face(26) },
  { name: "James Carter", role: "Client Success", photo: face(68) },
];
