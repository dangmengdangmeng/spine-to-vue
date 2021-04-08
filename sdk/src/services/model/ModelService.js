import Model from "../../models/model/Model"

class ModelService {
    static getJsonInfo(url) {
        return Model.show(url)
    }
}

export default ModelService
