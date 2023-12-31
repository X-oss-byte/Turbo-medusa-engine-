import { ProductCollection } from "@models"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { Context, DAL, ProductTypes } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { DALUtils, MedusaError } from "@medusajs/utils"

// eslint-disable-next-line max-len
export class ProductCollectionRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductCollection> = { where: {} },
    context: Context = {}
  ): Promise<ProductCollection[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      ProductCollection,
      findOptions_.where as MikroFilterQuery<ProductCollection>,
      findOptions_.options as MikroOptions<ProductCollection>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductCollection> = { where: {} },
    context: Context = {}
  ): Promise<[ProductCollection[], number]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      ProductCollection,
      findOptions_.where as MikroFilterQuery<ProductCollection>,
      findOptions_.options as MikroOptions<ProductCollection>
    )
  }

  async delete(collectionIds: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(
      ProductCollection,
      { id: { $in: collectionIds } },
      {}
    )
  }

  async create(
    data: ProductTypes.CreateProductCollectionDTO[],
    context: Context = {}
  ): Promise<ProductCollection[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const productCollections = data.map((collectionData) => {
      return manager.create(ProductCollection, collectionData)
    })

    manager.persist(productCollections)

    return productCollections
  }

  async update(
    data: ProductTypes.UpdateProductCollectionDTO[],
    context: Context = {}
  ): Promise<ProductCollection[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const collectionIds = data.map((collectionData) => collectionData.id)
    const existingCollections = await this.find(
      {
        where: {
          id: {
            $in: collectionIds,
          },
        },
      },
      context
    )

    const existingCollectionsMap = new Map(
      existingCollections.map<[string, ProductCollection]>((collection) => [
        collection.id,
        collection,
      ])
    )

    const productCollections = data.map((collectionData) => {
      const existingCollection = existingCollectionsMap.get(collectionData.id)

      if (!existingCollection) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `ProductCollection with id "${collectionData.id}" not found`
        )
      }

      return manager.assign(existingCollection, collectionData)
    })

    manager.persist(productCollections)

    return productCollections
  }
}
