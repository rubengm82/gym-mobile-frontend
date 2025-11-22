import { Redirect } from 'expo-router';

//  Hace redirect a la route de login de la App,
//   que será la route de inicio y esta si se logea pasara a
//   /main o seguirá deslogeado en /login
export default function Index() {
  return <Redirect href="/login" />;
}
