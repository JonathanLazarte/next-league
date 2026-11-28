"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/hooks/useRouter";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useI18n } from "@/hooks/useI18n";
import { useAuth } from "@/hooks/useAuth";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import BackendStatusBanner from "@/components/BackendFallback/BackendStatusBanner";
import "../auth.css";
import { UserCredentials } from "@/types/user";

export default function Register() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { loading, error, register } = useAuth();
  const { t } = useI18n();

  const initialValues = {
    userName: "",
    password: "",
  };

  const validationSchema = () =>
    Yup.object().shape({
      userName: Yup.string()
        .required(t("common.required"))
        .min(6, t("common.minLength")),
      password: Yup.string().required(t("common.required")),
    });
  const onSubmit = async (values: UserCredentials) => {
    setErrorMessage(null);
    await register({
      userName: values.userName,
      password: values.password,
    }).unwrap();
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const {
    handleChange,
    handleSubmit,
    errors, handleBlur,
    /*touched,*/ values,
  } = formik;

  const isButtonDisabled = !values.password || !values.userName || loading || errors.userName !== undefined || errors.password !== undefined

  useEffect(() => {
    if (error) {
      setErrorMessage(null);
    }
  }, [values.password, values.userName]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error)
    }
  }, [error])

  return (
    <div className="main-menu register">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo-container">
          <Image
            className="riot-games-logo"
            src="/riot-games.png"
            width={200}
            height={60}
            alt="RiotGames Logo"
          />
        </div>
        <BackendStatusBanner className="mb-3" />
        <div className="register-header">
          <h2 className="register-title">{t("auth.register")}</h2>
          <div className="active-indicator"><div className="active-indicator-inner"></div></div>
        </div>
        <div
          className="auth-loading-spinner"
          style={{ display: loading ? "block" : "none" }}
        >
          <img src="/red-loading-circle.png" alt="loading spinner" />
        </div>

        <section
          className="form-interface"
          style={{ display: loading ? "none" : "flex" }}
        >
          <div className="error-box">{errorMessage ? errorMessage : null}</div>
          <div
            className={`auth-input-wrapper ${error ? "errorMessage" : null}`}
          >
            <input
              name="userName"
              type="text"
              className="auth-input"
              id="userName"
              placeholder=" "
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <label className="label-placeholder">
              {t("auth.username")}
            </label>
          </div>
          {/*errors.userName && touched.userName && <div className="error-text">{errors.userName}</div>*/}
          <div
            className={`auth-input-wrapper ${error ? "errorMessage" : null}`}
          >
            <input
              name="password"
              type="password"
              className="auth-input"
              id="password"
              placeholder=" "
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <label className="label-placeholder" >
              {t("auth.password")}
            </label>
          </div>
          {/*errors.password && touched.password && <div className="error-message">{errors.password}</div>*/}
        </section>
        <div className="actions-box">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`login-button ${!values.userName || !values.password || loading || errors.userName || errors.password ? "disabled" : null}`}
            style={{ display: loading ? "none" : "flex" }}
          >
            <FaArrowRight />
          </button>
          <a className="auth-link" onClick={() => router.push("/login")}>{t("auth.haveAccount")}</a>
          <div className="disclaimer">
            <span className="disclaimer-line">
              {t("auth.captcha")}
            </span>
            <span className="disclaimer-line">
              <a>{t("auth.privacy")}</a> {t("auth.and")} <a>{t("auth.terms")}</a> {t("auth.apply")}
            </span>
          </div>
        </div>

      </form>
    </div>
  );
}
