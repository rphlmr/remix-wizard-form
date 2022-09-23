import { Link, Outlet, useNavigate } from "@remix-run/react";
import type { WizardHandle } from "~/hooks/use-outlet-handle";
import { useOutletHandle } from "~/hooks/use-outlet-handle";

export type OnboardingWizardHandle = WizardHandle<"onboarding"> & {
  title: string;
  stepNumber: number;
  submitButton: React.ReactElement;
};

export default function WizardStepsLayoutScreen() {
  const { title, stepNumber, submitButton } =
    useOutletHandle<OnboardingWizardHandle>("onboarding")[0];

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        display: "flex",
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1 style={{ textAlign: "center" }}>{title}</h1>
      <Outlet />
      <div style={{ marginTop: "12px" }}>
        {stepNumber !== 1 ? <BackButton /> : null}
        <span style={{ marginLeft: "12px", marginRight: "12px" }}>
          Step {stepNumber} of 3
        </span>
        {submitButton}
      </div>
    </div>
  );
}

function BackButton() {
  const navigate = useNavigate();
  return (
    <Link
      to=""
      onClick={(e) => {
        navigate(-1);
        e.preventDefault();
      }}
      className="button"
    >
      Back
    </Link>
  );
}
