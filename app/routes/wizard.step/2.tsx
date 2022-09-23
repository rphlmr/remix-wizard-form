import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { OnboardingWizardSession } from "~/sessions/wizard-session.server";
import { getMaybeWizardSession } from "~/sessions/wizard-session.server";
import { commitWizardSession } from "~/sessions/wizard-session.server";
import { assertReferer } from "~/utils/assert-referer.server";
import type { OnboardingWizardHandle } from "../wizard.step";

export const handle: OnboardingWizardHandle = {
  key: "onboarding",
  title: "Enter your favorite color",
  stepNumber: 2,
  submitButton: (
    <button type="submit" form="step-2" className="button">
      Next to step 3
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
    await getMaybeWizardSession<OnboardingWizardSession>(request);

  return json(onboardingWizardSession);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const { favoriteColor, nextStep } = Object.fromEntries(formData) as Pick<
    OnboardingWizardSession,
    "favoriteColor"
  > & {
    nextStep: string;
  };

  return redirect(`wizard/step/${nextStep}`, {
    headers: {
      "Set-Cookie": await commitWizardSession(request, { favoriteColor }),
    },
  });
}

export default function WizardStep2Screen() {
  const data = useLoaderData<typeof loader>();

  return (
    <Form
      id="step-2"
      method="post"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <label>
        Favorite color :
        <input
          type="text"
          name="favoriteColor"
          defaultValue={data?.favoriteColor}
        />
      </label>

      <input type="hidden" name="nextStep" value="3" />
    </Form>
  );
}
