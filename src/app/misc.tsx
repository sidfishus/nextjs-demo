
export const AddOptionalClass = (className: string, add: boolean, optionalClassName: string)=>
    add ? className + " " + optionalClassName : className;