import { ErrorsRecord } from "core";

export enum PropertyErrorCodes {
    images6AtMost = "IMAGES_6_AT_MOST",
    wrongStateSequence = "WRONG_STATE_SEQUENCE",
    propertyNotCompleted = "PROPERTY_NOT_COMPLETED"
}

ErrorsRecord.addErrors("Property" , Object.values(PropertyErrorCodes));