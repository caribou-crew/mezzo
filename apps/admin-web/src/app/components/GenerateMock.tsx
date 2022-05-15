import {
  MEZZO_API_PATH,
  MEZZO_API_PUT_GENERATE_MOCK,
} from '@caribou-crew/mezzo-constants';
import { useRef, useState } from 'react';

export default function GenerateMock() {
  const url = `${MEZZO_API_PATH}/mock`;

  const [user, setUser] = useState();
  const form = useRef(null);

  const submit = (e: any) => {
    e.preventDefault();
    const data = new FormData(form.current || undefined);
    fetch(MEZZO_API_PUT_GENERATE_MOCK, { method: 'POST', body: data })
      .then((res) => res.json())
      .then((json) => setUser(json));
  };

  return (
    <form ref={form} onSubmit={submit}>
      <input type="file" name="mockResponseFile" />
      <select id="cars" name="method">
        <option value="GET">GET</option>
        <option value="DELETE">DELETE</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
      </select>
      <input
        type="text"
        name="routePath"
        defaultValue="/api/food/meat"
        required
      />
      <input type="text" name="id" />
      <input type="text" name="variant" defaultValue="default" />
      {/* <input type="text" name="icons"  />  */}
      {/* <input type="text" name="titleIcons" defaultValue='/api/food/meat' />  */}

      <input type="submit" value="Upload!" />
    </form>
  );
}
