"use client";

import { useCallback, useEffect, useState } from "react";
import Dialog from "../Dialog/Dialog";
import InputText from "../InputText/InputText";
import { useSettings } from "../shared/SettingsContext";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { ConfigDialogProps } from "./ConfigDialog.type";

export default function ConfigDialog({ isOpen, onClose }: ConfigDialogProps) {
  const { settings, toggleSound, updateTime } = useSettings();
  const [minutes, setMinutes] = useState<number>(settings.timeInSeconds / 60);

  useEffect(() => {
    setMinutes(settings.timeInSeconds / 60);
  }, [settings.timeInSeconds]);

  const validateMinutes = useCallback((value: number): boolean => {
    if (isNaN(value) || value < 1) {
      return false;
    }
    return true;
  }, []);

  const handleMinutesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setMinutes(value);
      validateMinutes(value);
    },
    [validateMinutes]
  );

  const handleMinutesBlur = useCallback(() => {
    if (!validateMinutes(minutes)) {
      // Revert to last valid value
      setMinutes(settings.timeInSeconds / 60);
    } else {
      // Only update if valid
      updateTime(minutes * 60);
    }
  }, [minutes, settings.timeInSeconds, updateTime, validateMinutes]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="px-3 py-6 space-y-6">
        <ToggleSwitch
          onChange={toggleSound}
          checked={settings.soundEnabled}
          label="Enable sound"
        />

        <InputText
          id="time-input"
          value={minutes}
          onChange={handleMinutesChange}
          onBlur={handleMinutesBlur}
          label="Time (minutes):"
          type="number"
        />
      </div>
    </Dialog>
  );
}
