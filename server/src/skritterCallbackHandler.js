module.exports = () => (req, res) => {
  console.log({
    request: {
      path: req.path,
      query: req.query,
    }
  });
  res.json({});
};
