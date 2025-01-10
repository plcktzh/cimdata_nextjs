"use client";

import { useActionState } from "react";
import SubmitButton from "../SubmitButton";
import { addSignature } from "./petitionServerActions";

export default function PetitionForm() {
  const [actionState, formAction, pending] = useActionState(addSignature, {
    message: "",
    status: "",
    inputs: null,
  });

  return (
    <form className='petition-form' action={formAction}>
      <div className='inputs'>
        <div className='inputWrapper'>
          <label htmlFor='name'>Name (optional)</label>
          <input
            id='name'
            name='name'
            maxLength={100}
            autoComplete='name'
            defaultValue={actionState.inputs?.get("name") as string}
          />
        </div>
        <div className='inputWrapper'>
          <label htmlFor='email'>E-Mail</label>
          <input
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            required
            defaultValue={actionState.inputs?.get("email") as string}
          />
        </div>
      </div>
      <label>
        <input
          type='checkbox'
          name='privacy'
          value='accept'
          required
          defaultChecked={actionState.inputs?.get("privacy") === "accept"}
        />
        Ich stimme den Datenschutzbedingungen zu
      </label>
      <SubmitButton pendingContent={<strong>Ey! Geduld!</strong>} />
      {actionState.message && (
        <strong className='message'>{actionState.message}</strong>
      )}
    </form>
  );
}
