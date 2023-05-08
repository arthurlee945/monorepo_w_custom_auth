import { FC } from "react";
import Link from "next/link";
import styled, { css } from "styled-components";
import { UseFormRegister, FieldValues, UseFormResetField, FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { colors } from "global-constants";
import FormErrorMessage from "./FormErrorMessage";

const CheckBoxInputContaienr = styled.div<{ $error: boolean }>`
    position: relative;
    display: flex;
    flex-direction: column;
    .checkbox-container {
        display: flex;
        .checkbox {
            appearance: none;
            position: relative;
            margin-right: 15px;
            width: 20px;
            height: 20px;
            aspect-ratio: 1/1;
            border: 1px solid ${colors.lightGrey};
            transition: border-color 300ms;
            cursor: pointer;
            &:after {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                content: url("data:image/svg+xml,%3Csvg fill='%23070707' width='100%25' height='100%25' viewBox='-3.5 0 19 19' xmlns='http://www.w3.org/2000/svg' class='cf-icon-svg'%3E%3Cpath d='M4.63 15.638a1.028 1.028 0 0 1-.79-.37L.36 11.09a1.03 1.03 0 1 1 1.58-1.316l2.535 3.043L9.958 3.32a1.029 1.029 0 0 1 1.783 1.03L5.52 15.122a1.03 1.03 0 0 1-.803.511.89.89 0 0 1-.088.004z'/%3E%3C/svg%3E");
                transition: clip-path 300ms;
                clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
            }
            &:hover {
                border-color: ${colors.grey};
            }
            &:checked {
                border-color: ${colors.darkGrey};
                &:after {
                    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
                }
            }
        }
        .checkbox-label {
            cursor: pointer;
            .terms-of-use-link {
                font-weight: 700;
                color: ${colors.blue};
                &:hover {
                    text-decoration: underline;
                    text-decoration-color: ${colors.blue};
                }
            }
        }
        ${({ $error }) =>
            $error &&
            css`
                .checkbox {
                    border-color: ${colors.amber};
                    &:hover {
                        border-color: ${colors.darkAmber};
                    }
                }
                .checkbox-label {
                    color: ${colors.amber};
                    .terms-of-use-link {
                        color: ${colors.amber};
                        &:hover {
                            text-decoration: underline;
                            text-decoration-color: ${colors.amber};
                        }
                    }
                }
            `}
    }
`;

interface CheckBoxInputProps {
    id: string;
    label?: string;
    legal?: boolean;
    errors: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
    register: UseFormRegister<FieldValues>;
    resetField: UseFormResetField<FieldValues>;
}

const CheckBoxInput: FC<CheckBoxInputProps> = ({ id, label, legal = true, errors, register }) => {
    return (
        <CheckBoxInputContaienr $error={!!errors}>
            <div className="checkbox-container">
                <input id={id} className="checkbox" type="checkbox" {...register(id)} />
                <label className="paragraph-small checkbox-label" htmlFor={id}>
                    {legal ? (
                        <>
                            By continuing, you are setting up an account with this app and agree to our{" "}
                            <Link className="terms-of-use-link" href="/" target="_blank">
                                Terms of Use
                            </Link>
                            .
                        </>
                    ) : (
                        label
                    )}
                </label>
            </div>
            <FormErrorMessage errors={errors} />
        </CheckBoxInputContaienr>
    );
};

export default CheckBoxInput;
