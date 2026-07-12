package helpers

import "reflect"

// func Reflector[T any, U any](obj1 T, obj2 U) U {
// 	obj1Type := reflect.TypeOf(obj1)
// 	obj2Type := reflect.TypeOf(obj2)

// 	var returnedObj U

// 	for i := 0; i < obj1Type.NumField(); i ++ {
// 		obj1Field := obj1Type.Field(i)

// 		for j := 0; j < obj2Type.NumField(); j ++ {
// 			obj2Field = obj2Type.Field(j)

// 		}
// 	}

// 	return returnedObj
// }

func AssignValues(src interface{}, dest interface{}) {
	srcVal := reflect.ValueOf(src)
	destVal := reflect.ValueOf(dest)

	if destVal.Kind() != reflect.Ptr {
		return
	}
	destVal = destVal.Elem()

	if srcVal.Kind() != reflect.Struct {
		return
	}

	for i := 0; i < destVal.NumField(); i++ {
		destField := destVal.Type().Field(i)
		
		srcFieldVal := srcVal.FieldByName(destField.Name)

		if srcFieldVal.IsValid() && srcFieldVal.Type() == destVal.Field(i).Type() {
			destVal.Field(i).Set(srcFieldVal)
		}
	}
}