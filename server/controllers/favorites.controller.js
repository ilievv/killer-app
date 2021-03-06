'use strict';

module.exports = function ({userData, itemListingData}) {
  function index(req, res) {
    res.status(200).json(req.user.favorites);
  }

  function create(req, res) {
    const loggedUser = req.user;
    const itemListingId = req.body.content;
    return itemListingData.getItemListingById(itemListingId)
      .then((listing) => {
        if (!listing) {
          throw new Error('Listing with this ID not found.');
        }
        const listingExists = loggedUser.favorites.some(l => {
          return l._id.toString() === listing.id.toString();
        });
        if (listingExists) {
          throw new Error('User already has this item in favorites.');
        }
        loggedUser.favorites.push(listing);
        return userData.updateUser(loggedUser);
      })
      .then(() => {
        res.status(200).json({ favorites: req.user.favorites.map(f => f._id) });
      })
      .catch((err) => {
        return res.status(400, { error: err.message }).send();
      });
  }

  function remove(req, res) {
    const loggedUser = req.user;
    const itemListingId = req.body.content;
    return itemListingData.getItemListingById(itemListingId)
      .then((listing) => {
        if (!listing) {
          throw new Error('Listing with this ID not found.');
        }
        const listingExists = loggedUser.favorites.some(l => {
          return l._id.toString() === listing.id.toString();
        });
        if (!listingExists) {
          throw new Error('User does not have this item in favorites.');
        }
        loggedUser.favorites = loggedUser.favorites.filter(f => f._id.toString() !== listing.id.toString());
        return userData.updateUser(loggedUser);
      })
      .then(() => {
        res.status(200).json({ favorites: req.user.favorites.map(f => f._id) });
      })
      .catch((err) => {
        return res.status(400, { error: err.message }).send();
      });
  }

  return {
    index,
    create,
    remove
  };
};