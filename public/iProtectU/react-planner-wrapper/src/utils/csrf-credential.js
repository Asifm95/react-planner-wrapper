const csrfNameElement = document.querySelector('meta[name="csrf_name"]');
const csrfValueElement = document.querySelector('meta[name="csrf_value"]');

export const csrf_name = csrfNameElement?.getAttribute('content');
export const csrf_value = csrfValueElement?.getAttribute('content');

// export default { csrf_name, csrf_value };
