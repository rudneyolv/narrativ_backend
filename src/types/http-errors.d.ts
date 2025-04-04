/** @format */

import "http-errors";

declare module "http-errors" {
  interface HttpError {
    field?: string;
    field_message?: string;
  }
}
