"use strict";

const ClientInfo = use("App/Models/ClientInfo");
const JSONAPISerializer = use("json-api-serializer");
const Serializer = new JSONAPISerializer();
const NotFoundException = use("App/Exceptions/NotFoundException");
const CreateException = use("App/Exceptions/CreateException");
const UpdateException = use("App/Exceptions/UpdateException");

class ClientInfoRepository {
  async all(page = 1, perPage = 25, orderBy = "created_at", sortBy = "desc") {
    let model = ClientInfo.query().orderBy(orderBy, sortBy);

    return await model.paginate(page, perPage);
  }

  findClientInfoId(id) {
    return ClientInfo.query()
      .where("id", id)
      .firstOrFail()
      .then(
        (response) => {
          return response;
        },
        (error) => {
          throw new NotFoundException(error);
        }
      );
  }

  async create(data) {
    try {
      return await ClientInfo.create(data);
    } catch (error) {
      throw new CreateException(error);
    }
  }

  async update(ClientInfo, data) {
    try {
      ClientInfo.merge(data);
      return await ClientInfo.save();
    } catch (error) {
      throw new UpdateException(error);
    }
  }

  serialize(resourceKey, collection = null, transformed, relationships = null) {
    let toBeSerialized = {
      id: "id",
      links: {
        self: (data) => `${resourceKey}/${data.id}`,
      },
    };

    if (collection) {
      const topLevelMeta = {
        topLevelMeta: () => {
          return {
            pagination: {
              total: collection.pages.total,
              per_page: collection.pages.perPage,
              current_page: collection.pages.page,
              total_pages: collection.pages.lastPage,
            },
          };
        },
      };

      toBeSerialized = Object.assign(toBeSerialized, topLevelMeta);
    }

    Serializer.register(resourceKey, toBeSerialized);

    return Serializer.serialize(resourceKey, transformed);
  }
}

module.exports = ClientInfoRepository;
