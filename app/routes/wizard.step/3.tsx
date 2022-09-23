import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { OnboardingWizardSession } from "~/sessions/wizard-session.server";
import { destroyWizardSession } from "~/sessions/wizard-session.server";
import { getWizardSession } from "~/sessions/wizard-session.server";
import { assertReferer } from "~/utils/assert-referer.server";
import type { OnboardingWizardHandle } from "../wizard.step";

export const handle: OnboardingWizardHandle = {
  key: "onboarding",
  title: "This is your preferences",
  stepNumber: 3,
  submitButton: (
    <button type="submit" form="step-3" className="button">
      Save my preferences
    </button>
  ),
};

export function meta() {
  return {
    title: `Step ${handle.stepNumber} | ${handle.title}}`,
  };
}

export async function loader({ request }: LoaderArgs) {
  assertReferer(request, { redirectTo: "/wizard" });

  const onboardingWizardSession =
    await getWizardSession<OnboardingWizardSession>(request);

  return json(onboardingWizardSession);
}

export async function action({ request }: ActionArgs) {
  return destroyWizardSession(request);
}

export default function WizardStep3Screen() {
  const data = useLoaderData<typeof loader>();
  return (
    <Form id="step-3" method="post">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Form>
  );
}
