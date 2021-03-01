export const errorToDispatch = (type, error) => ({
    type,
    error,
});

export const payloadToDispatch = (type, payload) => ({
    type,
    payload,
})