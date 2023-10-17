import SnackBar from "react-native-snackbar"
import COLORS from "./colors"

export default function SnackBarUtil({message , isError}) {
    return (
        SnackBar.show(
            {
                text:message,
                duration:SnackBar.LENGTH_LONG,
                backgroundColor:isError===true?'brown':'green',
            }
        )
    )
}