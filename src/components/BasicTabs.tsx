import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import type { ReactNode } from "react";

interface BasicTabsProps {
  labels: string[];
  value: number | false;
  onChange: (value: number) => void;
}

export default function BasicTabs({ labels, value, onChange }: BasicTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={(_, newValue: number) => onChange(newValue)}
      aria-label="Dashboard tabs"
      textColor="inherit"
      indicatorColor="secondary"
      variant="scrollable"
      scrollButtons="auto"
    >
      {labels.map((label, index) => (
        <Tab
          key={label}
          label={label}
          id={`dashboard-tab-${index}`}
          aria-controls={`dashboard-panel-${index}`}
        />
      ))}
    </Tabs>
  );
}

export function CustomTabPanel({ children, value, index }: {
  children?: ReactNode;
  value: number | false;
  index: number;
}) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      tabIndex={0}
      id={`dashboard-panel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
    >
      {value === index && children}
    </div>
  );
}
