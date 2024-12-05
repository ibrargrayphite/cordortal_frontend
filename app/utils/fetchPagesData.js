// initial api to get organization pages and its content
export const fetchPagesData = async () => {
    const currentDomain = process.env.NEXT_PUBLIC_DOMAIN;
    // https://8ip-resourceful-bohr.circumeo-apps.net/
    const res = await fetch(`https://ffd1-59-103-120-85.ngrok-free.app/template/pages/?domain=${currentDomain}`);
    const data = await res.json();
    // console.log("🚀 ~ fetchPagesData ~ data:", data)
    return data;
  };
  