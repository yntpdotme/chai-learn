// Structured (JSON) logs instead of plain strings — makes this trivial
// to grep/parse once it's running under systemd/journalctl in Phase 9.
export const requestLogger = async (c, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(JSON.stringify({
        level: "info",
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        ms,
        timestamp: new Date().toISOString(),
    }));
};
