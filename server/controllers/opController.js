const OpVisit = require('../models/OpVisits');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

const opRegisterController = async (req, res) => {
  try {
    console.log('Received OP registration data:', req.body);

    // Parse string dates using dayjs
    const dateTime = dayjs(req.body.dateTime, 'DD/MM/YYYY hh:mm A').toDate();
    const validTill = dayjs(req.body.validTill, 'DD/MM/YYYY hh:mm A').toDate();

    if (isNaN(dateTime.getTime()) || isNaN(validTill.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const newVisit = new OpVisit({
      ...req.body,
      dateTime,
      validTill
    });

    await newVisit.save();

    res.status(201).json({ message: 'OP registration data saved successfully' });
  } catch (error) {
    console.error('Error in OP registration controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { opRegisterController };
