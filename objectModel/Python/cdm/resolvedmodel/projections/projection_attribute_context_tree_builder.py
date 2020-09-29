# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from collections import OrderedDict
from typing import List, Optional

from cdm.enums import CdmAttributeContextType
from cdm.objectmodel import CdmAttributeContext
from cdm.resolvedmodel import ResolvedAttribute
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.resolvedmodel.projections.projection_context import ProjectionContext
from cdm.utilities import AttributeContextParameters
from cdm.utilities.string_utils import StringUtils


class ProjectionAttributeContextTreeBuilder:
    """
    Attribute context tree builder for projection operations that involve a search for a previously held attribute name.
    There are three types of attribute context nodes created out of such operations:

        Search For:
            The name of the attribute to search for, whether it's the current name of the attribute or a previously held name.
            Ex. A name in the 'includeAttributes' list (for Include) or the name specified in 'applyTo' (for Rename)

        Found:
            The name of the attribute that was found out of the search for name. Because this is the current name of the attribute,
            the search for name and the found name can be different. The search for name can return multiple found names.
            Ex. Given Rename(A->a) and then Include(A), search_for = 'A' and found = 'a'

        Action:
            The name of the attribute resulting out of the action (operation).
            Ex. Given Rename(A->a), the action/operation is to rename 'A' to 'a' so action (the resulting attribute) = 'a'

    Put together, the resulting attribute context will look like '../operation/index{n}/[name of operation]/[search_for]/[found]/[action]'
        Ex. ../operation/index1/operationRenameAttributes/A/a/aa, given search_for = 'A', found = 'a', action = 'aa'

    If search_for and found or found and action have the same name, then we just collapse the nodes
        Ex. ../operation/index1/operationRenameAttributes/A/a/a -> ../operation/index1/operationRenameAttributes/A/a/
        Ex. ../operation/index1/operationIncludeAttributes/B/B -> ../operation/index1/operationIncludeAttributes/B
    """

    def __init__(self, root: 'CdmAttributeContext'):
        # Root node to build the attribute context tree under
        self._root = root  # type: CdmAttributeContext

        # Mapping between a 'search for' string to the attribute context parameter created out of it
        self._search_for_to_search_for_attr_ctx_param = OrderedDict()  # type: Dict[str, AttributeContextParameters]

        # Mapping between a 'search for' attribute context parameter to all attribute context parameters created out of the
        # 'found' attributes
        self._search_for_attr_ctx_param_to_found_attr_ctx_param = OrderedDict()  # type: Dict[AttributeContextParameters, List[AttributeContextParameters]]

        # Mapping between a 'found' attribute context parameter to the attribute context parameter created out of the
        # 'action' attribute
        self._found_attr_ctx_param_to_action_attr_ctx_param = OrderedDict()  # type: Dict[AttributeContextParameters, AttributeContextParameters]

        # Mapping between an 'action' attribute context parameter to the resolved attribute resulting out of the action
        self._action_attr_ctx_param_to_res_attr = OrderedDict()  # type: Dict[AttributeContextParameters, ResolvedAttribute]


    def _create_and_store_attribute_context_parameters(self, search_for: str, found: 'ProjectionAttributeState', res_attr_from_action: 'ResolvedAttribute', attr_ctx_type: 'CdmAttributeContextType') -> None:
        """
        Creates the attribute context parameters for the search_for, found, and action nodes and then stores them in different maps.
        The maps are used when constructing the actual attribute context tree.
        :param search_for: The 'search for' string
        :param found: The projection attribute state that contains the 'found' attribute
        :param res_attr_from_action: The resolved attribute that resulted from the action
        :param attr_ctx_type: The attribute context type to give the 'action' attribute context parameter
        """

        # search_for is null when we have to construct attribute contexts for the excluded attributes in Include or the included attributes in Exclude,
        # as these attributes weren't searched for with a search_for name.
        # If search_for is null, just set it to have the same name as found so that it'll collapse in the final tree.
        if search_for is None:
            search_for = found._current_resolved_attribute.resolved_name

        # Create the attribute context parameter for the search_for node and store it in the map as [search_for name]:[attribute context parameter]
        search_for_attr_ctx_param = None
        if search_for not in self._search_for_to_search_for_attr_ctx_param:
            search_for_attr_ctx_param = AttributeContextParameters()
            search_for_attr_ctx_param._under = self._root
            search_for_attr_ctx_param._type = CdmAttributeContextType.ATTRIBUTE_DEFINITION
            search_for_attr_ctx_param._name = search_for

            self._search_for_to_search_for_attr_ctx_param[search_for] = search_for_attr_ctx_param
        else:
            search_for_attr_ctx_param = self._search_for_to_search_for_attr_ctx_param[search_for]

        # Create the attribute context parameter for the found node
        found_attr_ctx_param = AttributeContextParameters()
        found_attr_ctx_param._under = self._root  # Set this to be under the root for now, as we may end up collapsing this node
        found_attr_ctx_param._type = CdmAttributeContextType.ATTRIBUTE_DEFINITION
        found_attr_ctx_param._name = '{}{}'.format(found._current_resolved_attribute.resolved_name, '@' + str(found._ordinal) if found._ordinal is not None else '')

        # Store this in the map as [search_for attribute context parameter]:[found attribute context parameters]
        # We store it this way so that we can create the found nodes under their corresponding search_for nodes.
        if search_for_attr_ctx_param not in self._search_for_attr_ctx_param_to_found_attr_ctx_param:
            self._search_for_attr_ctx_param_to_found_attr_ctx_param[search_for_attr_ctx_param] = [found_attr_ctx_param]
        else:
            found_attr_ctx_params = self._search_for_attr_ctx_param_to_found_attr_ctx_param[search_for_attr_ctx_param]
            found_attr_ctx_params.append(found_attr_ctx_param)
            self._search_for_attr_ctx_param_to_found_attr_ctx_param[search_for_attr_ctx_param] = found_attr_ctx_params

        # Create the attribute context parameter for the action node
        action_attr_ctx_param = AttributeContextParameters()
        action_attr_ctx_param._under = self._root  # Set this to be under the root for now, as we may end up collapsing this node
        action_attr_ctx_param._type = attr_ctx_type  # This type will be updated once we implement the new attribute context types
        action_attr_ctx_param._name = res_attr_from_action.resolved_name

        # Store this in the map as [found attribute context parameter]:[action attribute context parameter]
        # We store it this way so that we can create the action nodes under their corresponding found nodes.
        self._found_attr_ctx_param_to_action_attr_ctx_param[found_attr_ctx_param] = action_attr_ctx_param

        # Store the action attribute context parameter with the resolved attribute resulting out of the action.
        # This is so that we can point the action attribute context to the correct resolved attribute once the attribute context is created.
        self._action_attr_ctx_param_to_res_attr[action_attr_ctx_param] = res_attr_from_action

    def _construct_attribute_context_tree(self, proj_ctx: 'ProjectionContext', set_attr_ctx: Optional[bool] = False) -> None:
        """
        Takes all the stored attribute context parameters, creates attribute contexts from them, and then constructs the tree.
        :param proj_ctx: The projection context
        :param set_attr_ctx: Whether to set the created attribute context on the associated resolved attribute
        """

        # Iterate over all the search_for attribute context parameters
        for search_for_attr_ctx_param in self._search_for_to_search_for_attr_ctx_param.values():
            search_for_attr_ctx = None

            # Fetch all the found attribute context parameters associated with this search_for
            found_attr_ctx_params = self._search_for_attr_ctx_param_to_found_attr_ctx_param[search_for_attr_ctx_param]

            # Iterate over all the found attribute context parameters
            for found_attr_ctx_param in found_attr_ctx_params:
                # We should only create the search_for node when search_for and found have different names. Else collapse the nodes together.
                if not StringUtils.equals_with_case(search_for_attr_ctx_param._name, found_attr_ctx_param._name):
                    # Create the attribute context for searchFor if it hasn't been created already and set it as the parent of found
                    if search_for_attr_ctx is None:
                        search_for_attr_ctx = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, search_for_attr_ctx_param)
                    found_attr_ctx_param._under = search_for_attr_ctx

                # Fetch the action attribute context parameter associated with this found
                action_attr_ctx_param = self._found_attr_ctx_param_to_action_attr_ctx_param[found_attr_ctx_param]

                # We should only create the found node when found and action have different names. Else collapse the nodes together.
                if not StringUtils.equals_with_case(found_attr_ctx_param._name, action_attr_ctx_param._name):
                    # Create the attribute context for found and set it as the parent of action
                    found_attr_ctx = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, found_attr_ctx_param)
                    action_attr_ctx_param._under = found_attr_ctx

                # Create the attribute context for action
                action_attr_ctx = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, action_attr_ctx_param)

                # Fetch the resolved attribute that should now point at this action attribute context
                res_attr_from_action = self._action_attr_ctx_param_to_res_attr[action_attr_ctx_param]

                # TODO (jibyun): For now, only set the created attribute context on the resolved attribute when specified to,
                # as pointing the resolved attribute at this attribute context won't work currently for certain operations (Include/Exclude).
                # This will be changed to always run once we work on the attribute context fix.
                if set_attr_ctx:
                    res_attr_from_action.att_ctx = action_attr_ctx
