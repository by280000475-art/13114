import { SiteShell } from "@/components/site-shell";
import { Workbench } from "@/components/workbench";

export default function CreatePage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Workbench />
      </div>
    </SiteShell>
  );
}
