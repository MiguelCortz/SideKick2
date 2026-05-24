import { createContext, useContext } from "react";

export type SectionId = "calendar" | "content" | "meetings";

export const sections: { id: SectionId; label: string; number: string }[] = [
  { id: "calendar", number: "1", label: "Weekly Calendar" },
  { id: "content", number: "2", label: "Content Deliverables" },
  { id: "meetings", number: "3", label: "Meeting Prep" },
];

type Ctx = {
  active: SectionId;
  setActive: (id: SectionId) => void;
  // approvals from Section 1
  approvals: Record<string, boolean>;
  setApproval: (key: string, value: boolean) => void;
  totalPublicaciones: number;
};

export const SectionContext = createContext<Ctx>({
  active: "calendar",
  setActive: () => {},
  approvals: {},
  setApproval: () => {},
  totalPublicaciones: 0,
});

export const useSection = () => useContext(SectionContext);
