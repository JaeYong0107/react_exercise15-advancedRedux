import { cartActions } from "./cart-slice";
import { uiActions } from "./ui-slice";

export function fetchCartData() {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await fetch('https://react-http-213d3-default-rtdb.firebaseio.com/cart.json');

            if (!response.ok) {
                throw new Error('Could not fetch cart data!');
            }

            const data = await response.json();
            return data;
        }

        try {
            const cartData = await fetchData();
            dispatch(cartActions.replaceCart({
                items: cartData.items || [],
                totalQuantity: cartData.totalQuantity
            }));
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Sending cart data failed!'
            }));
        }
    }
}

export function sendCartData(cart) {
    return async (dispatch) => {
        dispatch(uiActions.showNotification({
            status: 'pending',
            title: 'Sending....',
            message: 'Sending scart data!'
        }));

        const sendRequest = async () => {
            const response = await fetch(
                'https://react-http-213d3-default-rtdb.firebaseio.com/cart.json', { //firebase 서버 사용.
                method: 'PUT',
                body: JSON.stringify(cart),
            }
            );

            if (!response.ok) {
                dispatch(uiActions.showNotification({
                    status: 'error',
                    title: 'Error!',
                    message: 'Sending cart data failed!'
                }));
            }
        }

        try {
            await sendRequest();

            dispatch(uiActions.showNotification({
                status: 'success',
                title: 'Success!',
                message: 'Sent cart data successfully!'
            }));
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Sending cart data failed!'
            }));
        }

    }
}