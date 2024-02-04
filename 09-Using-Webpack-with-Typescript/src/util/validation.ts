    // Validator
export interface Validatable {
    value: string | number;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
}

export function validation(ValidationInput: Validatable) {
    let isValid = true;
    if (ValidationInput.required) {
        isValid = isValid && ValidationInput.value.toString().trim().length !== 0;
    } if (ValidationInput.minlength != null &&
        typeof ValidationInput.value === 'string') {
        isValid = isValid && ValidationInput.value.length >= ValidationInput.minlength;
    }
     if (ValidationInput.maxlength != null &&
        typeof ValidationInput.value === 'string') {
        isValid = isValid && ValidationInput.value.length <= ValidationInput.maxlength;
    }
     if (ValidationInput.minlength != null &&
        typeof ValidationInput.value === 'number') {
        isValid = isValid && ValidationInput.value >= ValidationInput.minlength;
    }
     if (ValidationInput.maxlength != null &&
        typeof ValidationInput.value === 'number') {
        isValid = isValid && ValidationInput.value <= ValidationInput.maxlength;
    }
    return isValid
}
