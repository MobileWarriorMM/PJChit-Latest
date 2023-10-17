import Ping from 'react-native-ping'
import { store } from '../redux/store';

export default async function TestPing(url) {

    var ms = 0;

    try {
  
        ms = await Ping.start("www.google.com", { timeout: 1000 });

        if (ms > 500) {

            store.dispatch({
                type: "SHOW_POOR_NET",
                payload: { visible: true }
            })

            setTimeout(() => {
                store.dispatch({
                    type: "SHOW_POOR_NET",
                    payload: { visible: false }
                })
            }, 3000)

        }


    } catch (error) {
       
    }
}