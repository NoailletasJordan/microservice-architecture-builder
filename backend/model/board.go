package model

import (
	"fmt"
	"log"
	"reflect"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type Board struct {
	ID        string     `json:"id,omitempty"`
	Title     string     `json:"title"`
	Owner     string     `json:"owner"`
	Data      string     `json:"data"`
	Password  *string    `json:"password,omitempty"`
	Deleted   *time.Time `json:"deleted,omitempty"`
	CreatedAt time.Time  `json:"created_at,omitempty"`
}

// Exported for use in controller
func GetValidator() *validator.Validate {
	var validate = validator.New(validator.WithRequiredStructEnabled())
	err := validate.RegisterValidation("type-string", isString)
	if err != nil {
		panic(err)
	}

	err = validate.RegisterValidation("isUUID", isValidUUID)
	if err != nil {
		panic(err)
	}

	return validate
}

func isValidUUID(fl validator.FieldLevel) bool {
	err := uuid.Validate(fl.Field().String())
	isValid := err == nil
	return isValid
}

func isString(fl validator.FieldLevel) bool {
	field := fl.Field()
	// Check if the field's kind is reflect.String
	return field.Kind() == reflect.String
}

// Exported for use in controller
func ValidateMapCustom(validate *validator.Validate, body map[string]any, rulesMap map[string]any) error {
	for key := range rulesMap {

		err := validate.Var(body[key], rulesMap[key].(string))
		if err != nil {
			if _, ok := err.(*validator.InvalidValidationError); ok {
				log.Printf("Invalid validation error: %v", err.Error())
				return err
			}
			if _, ok := err.(validator.ValidationErrors); ok {
				return fmt.Errorf("validation error on field: %s, failed on tag %s", key, err.(validator.ValidationErrors)[0].ActualTag())
			}
		}

	}
	// Check for extra fields in body that aren't in rules
	for key := range body {
		if _, exists := rulesMap[key]; !exists {
			return fmt.Errorf("unexpected field in request body: %s", key)
		}
	}

	return nil
}
