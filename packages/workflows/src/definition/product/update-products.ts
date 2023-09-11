import { ProductTypes, WorkflowTypes } from "@medusajs/types"

import { InputAlias, Workflows } from "../../definitions"
import {
  TransactionStepsDefinition,
  WorkflowManager,
} from "@medusajs/orchestration"
import { exportWorkflow, pipe } from "../../helper"
import { InventoryHandlers, ProductHandlers } from "../../handlers"
import { CreateProductsActions } from "./create-products"
import { updateProductsExtractCreatedVariants } from "../../handlers/middlewares/update-products-extract-created-variants"

export enum UpdateProductsActions {
  prepare = "prepare",
  updateProducts = "updateProducts",
  revertUpdateProducts = "revertUpdateProducts",
  attachSalesChannels = "attachSalesChannels",
  detachSalesChannels = "detachSalesChannels",
  // inventory
  createInventoryItems = "createInventoryItems",
  attachInventoryItems = "attachInventoryItems",
  detachInventoryItems = "detachInventoryItems",
}

// TODO: sales channels
// TODO: shipping profiles

// TODO: also detach inventory items from deleted variants
// TODO: diff middleware for variants

export const updateProductsWorkflowSteps: TransactionStepsDefinition = {
  next: {
    action: CreateProductsActions.prepare,
    noCompensation: true,
    next: {
      action: UpdateProductsActions.updateProducts,
      next: [
        // {
        //   action: UpdateProductsActions.attachSalesChannels,
        //   saveResponse: false,
        // },
        // {
        //   action: UpdateProductsActions.detachSalesChannels,
        //   saveResponse: false,
        // },
        {
          action: UpdateProductsActions.createInventoryItems,
          next: {
            action: UpdateProductsActions.attachInventoryItems,
          },
        },
      ],
    },
  },
}

const handlers = new Map([
  [
    UpdateProductsActions.prepare,
    {
      invoke: pipe(
        {
          merge: true,
          inputAlias: InputAlias.ProductsInputData,
          invoke: {
            from: InputAlias.ProductsInputData,
          },
        },
        ProductHandlers.updateProductsPrepareData
      ),
    },
  ],
  [
    UpdateProductsActions.updateProducts,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: [
            {
              from: InputAlias.ProductsInputData,
              alias: ProductHandlers.updateProducts.aliases.products,
            },
            {
              from: UpdateProductsActions.prepare,
            },
          ],
        },
        ProductHandlers.updateProducts
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.prepare,
            alias: ProductHandlers.revertUpdateProducts.aliases.preparedData,
          },
        },
        ProductHandlers.revertUpdateProducts
      ),
    },
  ],
  // [
  //   UpdateProductsActions.attachSalesChannels,
  //   {
  //     invoke: pipe(
  //       {
  //         merge: true,
  //         invoke: [
  //           {
  //             from: UpdateProductsActions.prepare,
  //             alias: ProductHandlers.revertUpdateProducts.aliases.preparedData,
  //           },
  //           {
  //             from: UpdateProductsActions.updateProducts,
  //           },
  //         ],
  //       },
  //       mapData((data) => ({
  //         productsHandleSalesChannelsMap: data.productHandleAddedChannelsMap,
  //       })),
  //       ProductHandlers.attachSalesChannelToProducts
  //     ),
  //     compensate: pipe(
  //       {
  //         merge: true,
  //         invoke: {
  //           from: UpdateProductsActions.prepare,
  //           alias: ProductHandlers.revertUpdateProducts.aliases.preparedData,
  //         },
  //       },
  //       mapData((data) => ({
  //         productsHandleSalesChannelsMap: data.productHandleAddedChannelsMap,
  //       })),
  //       ProductHandlers.detachSalesChannelFromProducts
  //     ),
  //   },
  // ],
  // [
  //   UpdateProductsActions.detachSalesChannels,
  //   {
  //     invoke: pipe(
  //       {
  //         merge: true,
  //         invoke: [
  //           {
  //             from: UpdateProductsActions.prepare,
  //             alias: ProductHandlers.revertUpdateProducts.aliases.preparedData,
  //           },
  //           {
  //             from: UpdateProductsActions.updateProducts,
  //           },
  //         ],
  //       },
  //       mapData((data) => ({
  //         productsHandleSalesChannelsMap: data.productHandleRemovedChannelsMap,
  //       })),
  //       ProductHandlers.detachSalesChannelFromProducts
  //     ),
  //     compensate: pipe(
  //       {
  //         merge: true,
  //         invoke: {
  //           from: UpdateProductsActions.prepare,
  //           alias: ProductHandlers.revertUpdateProducts.aliases.preparedData,
  //         },
  //       },
  //       mapData((data) => ({
  //         productsHandleSalesChannelsMap: data.productHandleRemovedChannelsMap,
  //       })),
  //       ProductHandlers.attachSalesChannelToProducts
  //     ),
  //   },
  // ],
  [
    UpdateProductsActions.createInventoryItems,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: [
            {
              from: UpdateProductsActions.prepare,
              alias: updateProductsExtractCreatedVariants.aliases.preparedData,
            },
            {
              from: UpdateProductsActions.updateProducts,
              alias: updateProductsExtractCreatedVariants.aliases.products,
            },
          ],
        },
        updateProductsExtractCreatedVariants,
        InventoryHandlers.createInventoryItems
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
          },
        },
        updateProductsExtractCreatedVariants,
        InventoryHandlers.removeInventoryItems
      ),
    },
  ],
  [
    UpdateProductsActions.attachInventoryItems,
    {
      invoke: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.attachInventoryItems.aliases.inventoryItems,
          },
        },
        InventoryHandlers.attachInventoryItems
      ),
      compensate: pipe(
        {
          merge: true,
          invoke: {
            from: UpdateProductsActions.createInventoryItems,
            alias:
              InventoryHandlers.detachInventoryItems.aliases.inventoryItems,
          },
        },
        InventoryHandlers.detachInventoryItems
      ),
    },
  ],
])

WorkflowManager.register(
  Workflows.UpdateProducts,
  updateProductsWorkflowSteps,
  handlers
)

export const updateProducts = exportWorkflow<
  WorkflowTypes.ProductWorkflow.CreateProductsWorkflowInputDTO,
  ProductTypes.ProductDTO[]
>(Workflows.UpdateProducts, UpdateProductsActions.updateProducts)
