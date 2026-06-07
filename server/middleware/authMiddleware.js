// Middleware для перевірки ролі організатора
const isOrganizer = (req, res, next) => {
    const { role } = req.body; 
    if (role !== 'organizer') {
        return res.status(403).json({ message: "Доступ заборонено. Ви не організатор." });
    }
    next();
};

module.exports = { isOrganizer };