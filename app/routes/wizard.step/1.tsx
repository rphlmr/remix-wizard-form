import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { OnboardingWizardSession } from "~/sessions/wizard-session.server";
import { getMaybeWizardSession } from "~/sessions/wizard-session.server";
import { commitWizardSession } from "~/sessions/wizard-session.server";
import type { OnboardingWizardHandle } from "../wizard.step";

export const handle: OnboardingWizardHandle = {
  key: "onboarding",
  title: "Enter your favorite fruit",
  stepNumber: 1,
  submitButton: (
    <button type="submit" form="step-1" className="button">
      Next to step 2
    </button>
  ),
};

export function meta() {
  return {
    title: `Step ${handle.stepNumber} | ${handle.title}}`,
  };
}

export async function loader({ request }: LoaderArgs) {
  const onboardingWizardSession =
    await getMaybeWizardSession<OnboardingWizardSession>(request);

  return json(onboardingWizardSession);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const { favoriteFruit, nextStep } = Object.fromEntries(formData) as Pick<
    OnboardingWizardSession,
    "favoriteFruit"
  > & {
    nextStep: string;
  };

  return redirect(`wizard/step/${nextStep}`, {
    headers: {
      "Set-Cookie": await commitWizardSession(request, { favoriteFruit }),
    },
  });
}

export default function WizardStep1Screen() {
  const data = useLoaderData<typeof loader>();

  return (
    <Form
      id="step-1"
      method="post"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <label>
        Favorite fruit :
        <input
          type="text"
          name="favoriteFruit"
          defaultValue={data?.favoriteFruit}
        />
      </label>

      <input type="hidden" name="nextStep" value="2" />
    </Form>
  );
}
