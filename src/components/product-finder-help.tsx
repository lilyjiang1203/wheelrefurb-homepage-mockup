import { useState } from "react";
import { Check, Mail, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import type { VehicleDetails } from "./product-finder-data";

export function ProductFinderHelp({ open, onOpenChange, vehicle }: { open: boolean; onOpenChange: (open: boolean) => void; vehicle: VehicleDetails }) {
  const [sent, setSent] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [fileError, setFileError] = useState("");
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="gpf-dialog">
      <DialogTitle>{sent ? "Project details ready" : "Email Our Team"}</DialogTitle>
      <DialogDescription>{sent ? "Demo confirmation only. No email has been sent and no photos have been uploaded." : "Tell us about your project. This example form does not send emails or upload photos."}</DialogDescription>
      {sent ? <div className="space-y-5"><Check className="text-brand" aria-hidden="true" /><p>Thank you — your project details have been captured for this preview.</p><Button className="gpf-primary" onClick={() => { onOpenChange(false); setSent(false); setPhotos([]); }}>Done</Button></div> :
        <form className="gpf-help-form" onSubmit={(event) => { event.preventDefault(); if (!fileError) setSent(true); }}>
          <div className="gpf-fields">
            <label>Name<Input name="name" autoComplete="name" required /></label>
            <label>Email<Input name="email" type="email" autoComplete="email" required /></label>
            <label>Vehicle Make<Input name="make" defaultValue={vehicle.make} /></label>
            <label>Vehicle Model<Input name="model" defaultValue={vehicle.model} /></label>
            <label>Year<Input name="year" type="number" min="1900" max="2027" defaultValue={vehicle.year} /></label>
            <label>Wheel Details<Input name="wheel" defaultValue={vehicle.wheel} /></label>
          </div>
          <label>OEM Color Code, if known<Input name="code" defaultValue={vehicle.code} /></label>
          <label>What are you trying to do?<Input name="goal" defaultValue="Restore the Original OEM Finish" required /></label>
          <label>Additional Notes<textarea name="notes" className="gpf-control" rows={3} /></label>
          <label className="gpf-upload"><span className="flex items-center gap-2"><Upload size={16} aria-hidden="true" />Upload Wheel Photos</span><Input aria-label="Upload Wheel Photos" type="file" accept="image/*" multiple onChange={(event) => {
            const files = Array.from(event.target.files || []);
            const invalid = files.some((file) => !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024);
            setFileError(invalid ? "Please select image files smaller than 10 MB each." : "");
            setPhotos(invalid ? [] : files.map((file) => file.name));
          }} /><span className="text-xs text-muted-foreground">Images only · Up to 10 MB each</span></label>
          {photos.length > 0 && <ul className="text-sm text-muted-foreground break-words">{photos.map((name, index) => <li key={`${name}-${index}`}>{name}</li>)}</ul>}
          {fileError && <p role="alert" className="text-destructive">{fileError}</p>}
          <Button type="submit" className="gpf-primary" disabled={Boolean(fileError)}><Mail aria-hidden="true" />Send Project Details</Button>
        </form>}
    </DialogContent>
  </Dialog>;
}