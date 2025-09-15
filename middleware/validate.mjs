export function validator(req, res, next) {
    const { title, author, genre } = req.body;
    if (!title || !author || !genre) {
        return res.status(400).send("All fields (title, author, genre) are required.");
    }
    next();
}
  