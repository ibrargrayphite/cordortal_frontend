// initial api to get organization pages and its content
export const fetchPagesData = async () => {
    const currentDomain = process.env.NEXT_PUBLIC_DOMAIN;
    // http://18.224.190.123
    const res = await fetch(`http://18.224.190.123/template/pages/?domain=${currentDomain}`);
    const data = await res.json();
    // console.log("🚀 ~ fetchPagesData ~ data:", data)
    return data;
  };
  