// utils/fetchPagesData.js
let cachedPagesData = null;

export async function fetchPagesData() {
  const currentDomain = process.env.NEXT_PUBLIC_DOMAIN;

  if (!cachedPagesData) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/template/pages/?domain=${currentDomain}`);
    cachedPagesData = await response.json();
    // console.log("🚀 ~ fetchPagesData ~ cachedPagesData:", cachedPagesData)
  }
  return cachedPagesData;
}


// http://18.224.190.123
// const res = await fetch(`https://3253-59-103-120-85.ngrok-free.app/template/pages/?domain=${currentDomain}`);